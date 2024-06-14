export enum MainServiceMsgType {
    COPY = '[MainServiceMsg] - COPY',
    REQUEST_PASTE = '[MainServiceMsg] - REQUEST_PASTE',
    PASTE = '[MainServiceMsg] - PASTE',
    MINIMIZE = '[MainServiceMsg] - MINIMIZE',
    TOGGLE_MAXIMIZE = '[MainServiceMsg] - TOGGLE_MAXIMIZE',
    CLOSE = '[MainServiceMsg] - CLOSE',
};

export interface MainServiceMsgTypes {
    Copy: {
        type: MainServiceMsgType.COPY;
        data: string;
    }
    RequestPaste: {
        type: MainServiceMsgType.REQUEST_PASTE;
    }
    Paste: {
        type: MainServiceMsgType.PASTE;
        data: string;
    }
    Minimize: {
        type: MainServiceMsgType.MINIMIZE
    }
    ToggleMaximize: {
        type: MainServiceMsgType.TOGGLE_MAXIMIZE
    }
    Close: {
        type: MainServiceMsgType.CLOSE
    }
    
}

export type MainServiceMsgKey = keyof MainServiceMsgTypes;

export type MainServiceMsg = MainServiceMsgTypes[MainServiceMsgKey];
