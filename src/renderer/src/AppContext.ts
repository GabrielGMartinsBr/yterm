import { createContext, useContext } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { RefSet4 } from './hooks/useRefSet4';

export type SelectedTab = TerminalTabUid | null;

export interface AppContextType {
    tabs: TerminalTab[];
    selectedTab: SelectedTab;

    wrapRefSet: RefSet4<HTMLDivElement | null>;
    termRefSet: RefSet4<Terminal | null>;
    fitAddonRefSet: RefSet4<FitAddon | null>;

    createTab: () => void;
    closeTab: (uid: TerminalTabUid) => void;
    selectTab: (uid: TerminalTabUid) => void;
}

export const appContext = createContext<AppContextType | null>(null);

export function useAppContext() {
    const ctx = useContext(appContext);
    if (!ctx) {
        throw new Error('AppContext provider not found.');
    }
    return ctx;
}