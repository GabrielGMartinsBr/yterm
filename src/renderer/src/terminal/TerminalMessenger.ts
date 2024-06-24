import { TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { TerminalTabUid } from '@common/types/TerminalTab';

export class TerminalMessenger {

    static fetchTabs() {
        window.api.sendToTerminal({ type: TerminalMsgType.FETCH_TABS });
    }

    static createTab() {
        window.api.sendToTerminal({ type: TerminalMsgType.CREATE_TAB });
    }

    static closeTab(uid: TerminalTabUid) {
        window.api.sendToTerminal({
            type: TerminalMsgType.CLOSE_TAB,
            uid
        });
    }

    static send(uid: TerminalTabUid, key: string) {
        window.api.sendToTerminal({
            uid: uid,
            type: TerminalMsgType.INPUT,
            data: key
        });
    }
    static emitClear(uid: TerminalTabUid) {
        window.api.sendToTerminal({
            uid: uid,
            type: TerminalMsgType.CLEAR
        });
    }

    static emitResize(uid: TerminalTabUid, cols: number, rows: number) {
        window.api.sendToTerminal({
            type: TerminalMsgType.RESIZE,
            uid: uid,
            cols: cols,
            rows: rows
        });
    }

}