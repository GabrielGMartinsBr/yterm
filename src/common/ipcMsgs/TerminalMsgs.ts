export enum TerminalMsgType {
    INIT = '[TerminalMsg] - INIT',
    INPUT = '[TerminalMsg] - INPUT',
    OUTPUT = '[TerminalMsg] - OUTPUT',
    RESIZE = '[TerminalMsg] - RESIZE',
    CLEAR = '[TerminalMsg] - CLEAR',
    FULL_SCREEN = '[TerminalMsg] - FULL_SCREEN',
};

export interface TerminalMsgTypes {
    Init: {
        type: TerminalMsgType.INIT;
    }

    Input: {
        type: TerminalMsgType.INPUT;
        data: string;
    }

    Output: {
        type: TerminalMsgType.OUTPUT;
        uid: string;
        pwd: string;
        data: string;
    }

    Resize: {
        type: TerminalMsgType.RESIZE;
        cols: number;
        rows: number;
    }

    Clear: {
        type: TerminalMsgType.CLEAR;
    }

    FullScreen: {
        type: TerminalMsgType.FULL_SCREEN;
    }
}

export type TerminalMsgKey = keyof TerminalMsgTypes;

export type TerminalMsg = TerminalMsgTypes[TerminalMsgKey];
