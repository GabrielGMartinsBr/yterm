import { ElectronAPI } from '@electron-toolkit/preload'
import { ScriptsMsg } from '@common/ipcMsgs/ScriptsMsgs';
import { LauncherMsg } from '@common/ipcMsgs/LauncherMsgs';
import { EditorBServiceMsg } from '@common/ipcMsgs/EditorBServiceMsgs';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      msgToEditorBService: (msg: EditorBServiceMsg, ...args: unknown[]) => void;

      onWinResize: (cb: () => void) => unknown;
      sendMsgToScripts(action: ScriptsMsg): void;
      sendMsgToLauncherService(msg: LauncherMsg): void;
    }
  }
}
