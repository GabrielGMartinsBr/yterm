import { ElectronAPI } from '@electron-toolkit/preload'
import { ScriptsMsg } from '@common/ipcMsgs/ScriptsMsgs';
import { LauncherMsg } from '@common/ipcMsgs/LauncherMsgs';
import { EditorBServiceMsg } from '@common/ipcMsgs/EditorBServiceMsgs';
import { TerminalMsg } from '@common/ipcMsgs/TerminalMsgs';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendToTerminal: (msg: TerminalMsg, ...args: unknown[]) => void;
    }
  }
}
