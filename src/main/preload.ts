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
import { contextBridge, ipcRenderer } from 'electron';
import { UtmParams } from '../renderer/types';

export type Channels = 'utm-builder';
export type Events =
  | 'get-config'
  | 'get-params'
  | 'save-config'
  | 'check-passwd';

export type electronAPI = {
  getConfig: () => Promise<string>;
  getParams: (key: string) => Promise<string>;
  saveConfig: (key: string) => Promise<string>;
  checkPass: () => Promise<string>;
};

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => {
    return ipcRenderer.invoke('get-config');
  },
  getParams: (key: string) => {
    return ipcRenderer.invoke('get-params', key);
  },
  saveConfig: (key: string) => {
    return ipcRenderer.invoke('save-config', key);
  },
  checkPass: () => {
    return ipcRenderer.invoke('check-passwd');
  },
});

// Path: src/main/preload.ts

declare global {
  interface Window {
    electronAPI: {
      getConfig: () => Promise<string>;
      getParams: (key: string) => Promise<string>;
      saveConfig: (key: string) => Promise<string>;
      checkPass: () => Promise<string>;
    };
  }
}
