import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';

export enum TerminalMsgType {
    TERMINAL_INSTANCES = '[TerminalMsg] - TERMINAL_INSTANCES',

    FETCH_TABS = '[TerminalMsg] - FETCH_TABS',
    CREATE_TAB = '[TerminalMsg] - CREATE_TAB',
    CLOSE_TAB = '[TerminalMsg] - CLOSE_TAB',
    COPY = '[TerminalMsg] - COPY',
    PASTE = '[TerminalMsg] - PASTE',

    INIT = '[TerminalMsg] - INIT',
    INPUT = '[TerminalMsg] - INPUT',
    OUTPUT = '[TerminalMsg] - OUTPUT',
    RESIZE = '[TerminalMsg] - RESIZE',
    CLEAR = '[TerminalMsg] - CLEAR',
    FULL_SCREEN = '[TerminalMsg] - FULL_SCREEN',
};

export interface TerminalMsgTypes {
    TerminalInstances: {
        type: TerminalMsgType.TERMINAL_INSTANCES;
        tabs: TerminalTab[];
    }

    FetchTabs: { type: TerminalMsgType.FETCH_TABS; }

    CreateTab: { type: TerminalMsgType.CREATE_TAB; }

    CloseTab: {
        type: TerminalMsgType.CLOSE_TAB;
        uid: TerminalTabUid;
    }

    Copy: {
        type: TerminalMsgType.COPY;
        uid: TerminalTabUid;
        data: string;
    }

    Paste: {
        type: TerminalMsgType.PASTE;
        uid: TerminalTabUid;
    }

    Init: {
        type: TerminalMsgType.INIT;
    }

    Input: {
        type: TerminalMsgType.INPUT;
        uid: TerminalTabUid;
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
        uid: TerminalTabUid;
        cols: number;
        rows: number;
    }

    Clear: {
        type: TerminalMsgType.CLEAR;
        uid: string;
    }

    FullScreen: {
        type: TerminalMsgType.FULL_SCREEN;
    }
}

export type TerminalMsgKey = keyof TerminalMsgTypes;

export type TerminalMsg = TerminalMsgTypes[TerminalMsgKey];
