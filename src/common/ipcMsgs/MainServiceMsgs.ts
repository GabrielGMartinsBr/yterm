export enum MainServiceMsgType {
    COPY = '[MainServiceMsg] - COPY',
    REQUEST_PASTE = '[MainServiceMsg] - REQUEST_PASTE',
    PASTE = '[MainServiceMsg] - PASTE',
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
    
}

export type MainServiceMsgKey = keyof MainServiceMsgTypes;

export type MainServiceMsg = MainServiceMsgTypes[MainServiceMsgKey];
