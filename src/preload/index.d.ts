import { ElectronAPI } from '@electron-toolkit/preload'
import { ScriptsMsg } from '@common/ipcMsgs/ScriptsMsgs';
import { LauncherMsg } from '@common/ipcMsgs/LauncherMsgs';
import { EditorBServiceMsg } from '@common/ipcMsgs/EditorBServiceMsgs';
import { TerminalMsg } from '@common/ipcMsgs/TerminalMsgs';
import { MainServiceMsg } from '@common/ipcMsgs/MainServiceMsgs';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      pushMainServiceMsg: (msg: MainServiceMsg, ...args: unknown[]) => void;
      sendToTerminal: (msg: TerminalMsg, ...args: unknown[]) => void;
    }
  }
}
