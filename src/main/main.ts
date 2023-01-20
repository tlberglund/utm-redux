/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { UtmParams, defaultUTMParams } from '../renderer/types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const electronApp = require('electron').app;

const home = process.env.HOME || process.env.USERPROFILE;
const store = new Store();
const defaultConfig: UtmParams = defaultUTMParams;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

/*
 * save the config to the store
 * @param event - Just send null, but it's required?
 * @param config - the config to save
 */
ipcMain.handle('save-config', (event: Event, config: string) => {
  store.delete('utm-config');
  store.set('utm-config', JSON.parse(config));
  return JSON.stringify(store.get('utm-config', defaultConfig));
});

/*
 * get the config from the store
 * @param event - Just send null, but it's required?
 */
ipcMain.handle('get-config', () => {
  return JSON.stringify(store.get('utm-config', defaultConfig));
});

/*
 * get the config from the store
 * @param event - Just send null, but it's required?
 */
ipcMain.handle('check-passwd', () => {
  return JSON.stringify(
    store.get(
      'admin-passwd',
      '27c8b224d0446d0fd76dc67c6f783f69e6b29cd8f43536306b7b8fad8266e82109afde3d4eb19b576f29bbc74807f06ba2ba5d0e7394b874df4dc8edcb8d8dea'
    )
  );
});

/*
 * get the config from the store
 * @param event - Just send null, but it's required?
 * @param pName - the name of the Configuration parameter to return
 */
ipcMain.handle('get-params', (e: Event, key: string) => {
  const params: UtmParams = JSON.parse(
    JSON.stringify(store.get('utm-config', defaultConfig))
  );
  switch (key) {
    case 'utm_target':
      return JSON.stringify(params.utm_target);
    case 'utm_source':
      return JSON.stringify(params.utm_source);
    case 'utm_medium':
      return JSON.stringify(params.utm_medium);
    case 'utm_campaign':
      return JSON.stringify(params.utm_campaign);
    case 'utm_term':
      return JSON.stringify(params.utm_term);
    case 'team_name':
      return JSON.stringify(params.team_name);
    case 'region_name':
      return JSON.stringify(params.region_name);
    case 'bitly_config':
      return JSON.stringify(params.bitly_config);
    default:
      return JSON.stringify(params);
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }​

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const options = {
    applicationName: 'UTM Builder',
    applicationVersion: 'v1.6.4',
    copyright: '© 2023',
    version: 'b1023',
    credits: 'David G. Simmons & Electron React Boilerplate',
    authors: ['David G. Simmons'],
    website: 'https://github.com/davidgs/utm-redux',
    iconPath: getAssetPath('icon.png')
  };
  app.setAboutPanelOptions(options)
  console.log(getAssetPath('icon.png'));
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 980,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
