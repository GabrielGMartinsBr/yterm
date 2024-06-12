import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalMsg } from '@common/ipcMsgs/TerminalMsgs';
import { MainServiceMsg } from '@common/ipcMsgs/MainServiceMsgs';

// Custom APIs for renderer
const api = {
  pushMainServiceMsg: (msg: MainServiceMsg, ...args: unknown[]) => {
    ipcRenderer.send(IpcChannel.MAIN, msg, ...args);
  },
  sendToTerminal(msg: TerminalMsg, ...args: unknown[]) {
    ipcRenderer.send(IpcChannel.TERMINAL, msg, ...args);
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}