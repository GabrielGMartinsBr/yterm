export enum MainServiceMsgType {
    MINIMIZE = '[MainServiceMsg] - MINIMIZE',
    TOGGLE_MAXIMIZE = '[MainServiceMsg] - TOGGLE_MAXIMIZE',
    CLOSE = '[MainServiceMsg] - CLOSE',
};

export interface MainServiceMsgTypes {
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
