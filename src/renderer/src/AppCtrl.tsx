import { PropsWithChildren, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { nanoid } from 'nanoid';

import { SelectedTab, appContext } from './AppContext';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';

export default function AppCtrl(props: PropsWithChildren) {
    const [tabs, tabsUpdate] = useImmer<TerminalTab[]>([
        { uid: nanoid() },
        { uid: nanoid() },
    ]);
    const [selectedTab, selectedTabSet] = useState<SelectedTab>(null);

    const createTab = () => {
        const newTabUid = nanoid();
        tabsUpdate(d => {
            d.push({
                uid: newTabUid
            });
        });
        selectedTabSet(newTabUid);
    };

    const closeTab = (uid: TerminalTabUid) => {
        const selectNextTab = (index: number) => {
            let nextTab = tabs[index + 1];
            if (!nextTab) {
                nextTab = tabs[index - 1];
            }
            if (nextTab) {
                selectTab(nextTab.uid);
            }
        };
        tabsUpdate(d => {
            const index = d.findIndex(i => i.uid === uid);
            if (index > -1) {
                d.splice(index, 1);
                selectNextTab(index);
            }
        });
    };

    const selectTab = (uid: TerminalTabUid) => {
        selectedTabSet(uid);
    };

    useEffect(() => {
        selectedTabSet(tabs[0].uid);
    }, []);

    return (
        <appContext.Provider value={{
            tabs,
            selectedTab,
            createTab,
            closeTab,
            selectTab
        }}>
            {props.children}
        </appContext.Provider>
    )
}
