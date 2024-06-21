import { PropsWithChildren } from 'react';
import { useImmer } from 'use-immer';
import { nanoid } from 'nanoid';

import { appContext } from './AppContext';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';

export default function AppCtrl(props: PropsWithChildren) {
    const [tabs, tabsUpdate] = useImmer<TerminalTab[]>([
        { uid: nanoid() },
        { uid: nanoid() },
    ]);

    const createTab = () => {
        tabsUpdate(d => {
            d.push({
                uid: nanoid()
            });
        });
    };

    const closeTab = (uid: TerminalTabUid) => {
        tabsUpdate(d => {
            const index = d.findIndex(i => i.uid === uid);
            if (index > -1) {
                d.splice(index, 1);
            }
        });
    };

    return (
        <appContext.Provider value={{
            tabs,
            createTab,
            closeTab
        }}>
            {props.children}
        </appContext.Provider>
    )
}
