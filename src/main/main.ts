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
import { app, BrowserWindow, autoUpdater, dialog, shell, ipcMain } from 'electron';
// import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { UtmParams, defaultUTMParams, QRSettings, defaultQRSettings } from '../renderer/types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { LinkData } from '../renderer/types';
import uuid from 'react-uuid';



const electronApp = require('electron').app;

const home = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || './';
const store = new Store();
const defaultConfig: UtmParams = defaultUTMParams;
const version = 'v1.6.3'
const server = 'http://update-server-davidgs.vercel.app/';
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

const up = autoUpdater;
up.setFeedURL({ url });
class AppUpdater {
  constructor() {
    log.verbose('AppUpdater::constructor');
    log.transports.file.level = 'debug';
    up.checkForUpdates();
  }
}

setInterval(() => {
  up.checkForUpdates();
}, 86400600);

up.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

let mainWindow: BrowserWindow | null = null;

/*
 * get the params from the store
 * @return QR Configuration settings
 */
ipcMain.handle('get-qr-settings', () => {
  return JSON.stringify(store.get('qr-settings', defaultQRSettings));
});

/*
 * save the QR Code config to the store
 * @param event - Just send null, but it's required?
 * @param config - the config to save
 */
ipcMain.handle('save-qr-settings', (event: Event, config: string) => {
  store.delete('qr-settings');
  store.set('qr-settings', JSON.parse(config));
  return JSON.stringify(store.get('qr-settings', defaultQRSettings));
});

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
 * save a link to the store
 * @param event - Just send null, but it's required?
 * @param linkData - the link to save
 * @returns the list of links
 */
ipcMain.handle('save-link', (event: Event, linkData: string) => {
  const links: LinkData[] = store.get('utm-links', []) as LinkData[];
  store.delete('utm-links');
  links.push(JSON.parse(linkData));
  store.set('utm-links', links);
  return JSON.stringify(links);
});

ipcMain.handle('save-svg', (event: Event, svg: string) => {
  const options = {
    title: 'Save QR Code',
    defaultPath: path.join(home, `qr-code-${uuid()}.svg`),
    createDirectory: true,
    filters: [{ name: 'SVG', extensions: ['svg'] }],
  };
  dialog.showSaveDialog(options).then((result) => {
    if (!result.canceled) {
      const fs = require('fs');
      fs.writeFile(result.filePath, svg, (err: any) => {
        if (err) {
          console.log(err);
        }
      });
      return result.filePath;
    }
    return 'cancelled';
  });
});
/*
 * get all the links in history
 * @param event - Just send null, but it's required?
 * @returns the list of links
 */
ipcMain.handle('get-links', () => {
  return JSON.stringify(store.get('utm-links', [{}]));
});

/* Clear all history links
 * @returns an empty list of links
 */
ipcMain.handle('clear-history', () => {
  store.delete('utm-links');
  return JSON.stringify(store.get('utm-links', [{}]));
});

/*
 * get the config from the store
 * @param event - Just send null, but it's required?
 */
ipcMain.handle('get-config', () => {
  return JSON.stringify(store.get('utm-config', defaultConfig));
});

/*
 * get the password from the store
 * @param event - Just send null, but it's required?
 */
ipcMain.handle('check-passwd', () => {
  return JSON.stringify(
    store.get(
       'admin-passwd', '27c8b224d0446d0fd76dc67c6f783f69e6b29cd8f43536306b7b8fad8266e82109afde3d4eb19b576f29bbc74807f06ba2ba5d0e7394b874df4dc8edcb8d8dea'
    )
  );
});

ipcMain.handle('set-passwd', (event: Event, passwd: string) => {
  store.delete('admin-passwd');
  store.set('admin-passwd', passwd);
  return(JSON.stringify(store.get('admin-passwd', '')));
});

/*
 * get the params from the store
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

ipcMain.handle('save-dark-mode', (e: Event, darkMode: boolean) => {
  store.delete('dark-mode');
  store.set('dark-mode', darkMode);
  return JSON.stringify(store.get('dark-mode', false));
});

ipcMain.handle('get-dark-mode', () => {
  return(JSON.stringify(store.get('dark-mode', false)));
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
  }
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const options = {
    applicationName: 'UTM Builder',
    applicationVersion: 'v1.7.0',
    copyright: '© 2023',
    version: 'b10',
    credits:
      'Credits:\n\t• David G. Simmons\n\t• StarTree Developer Relations Team\n\t• Electron React Boilerplate',
    authors: ['David G. Simmons'],
    website: 'https://github.com/davidgs/utm-redux',
    iconPath: getAssetPath('icon.png'),
  };
  app.setAboutPanelOptions(options);
  mainWindow = new BrowserWindow({
    show: false,
    width: 1124,
    height: 875,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  ipcMain.handle('clear-form', () => {
    mainWindow?.webContents.reload();
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
