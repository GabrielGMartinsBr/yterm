import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { createContext, useContext } from 'react';

export interface AppContextType {
    tabs: TerminalTab[];

    createTab: () => void;
    closeTab: (uid: TerminalTabUid) => void;
}

export const appContext = createContext<AppContextType | null>(null);

export function useAppContext() {
    const ctx = useContext(appContext);
    if (!ctx) {
        throw new Error('AppContext provider not found.');
    }
    return ctx;
}