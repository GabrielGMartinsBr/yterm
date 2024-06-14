import { MainServiceMsgType } from '@common/ipcMsgs/MainServiceMsgs';

export class MainServiceController {

    static minimize() {
        window.api.pushMainServiceMsg({
            type: MainServiceMsgType.MINIMIZE
        });
    }

    static toggleMaximize() {
        window.api.pushMainServiceMsg({
            type: MainServiceMsgType.TOGGLE_MAXIMIZE
        });
    }

    static close() {
        window.api.pushMainServiceMsg({
            type: MainServiceMsgType.CLOSE
        });
    }

}