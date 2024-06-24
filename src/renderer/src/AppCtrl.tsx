import { PropsWithChildren, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import { IpcChannel } from '@common/IpcDefinitions';
import { SelectedTab, appContext } from './AppContext';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalMessenger } from './terminal/TerminalMessenger';
import { useIpcMessage } from './hooks/useIpcMessage';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { useRefSet4 } from './hooks/useRefSet4';
import { useRefSet3 } from './hooks/useRefSet3';

export default function AppCtrl(props: PropsWithChildren) {
    const refs = useRefSet3(class {
        tabs: TerminalTab[] = [];
    });
    const wrapRefSet = useRefSet4<HTMLDivElement | null>();
    const termRefSet = useRefSet4<Terminal | null>();
    const fitAddonRefSet = useRefSet4<FitAddon | null>();
    
    const [tabs, tabsUpdate] = useImmer<TerminalTab[]>([]);
    const [selectedTab, selectedTabSet] = useState<SelectedTab>(null);

    const createTab = () => {
        // const newTabUid = nanoid();
        // tabsUpdate(d => {
        //     d.push({
        //         uid: newTabUid
        //     });
        // });
        // selectedTabSet(newTabUid);
        TerminalMessenger.createTab();
    };

    const closeTab = (uid: TerminalTabUid) => {
        // const selectNextTab = (index: number) => {
        //     let nextTab = tabs[index + 1];
        //     if (!nextTab) {
        //         nextTab = tabs[index - 1];
        //     }
        //     if (nextTab) {
        //         selectTab(nextTab.uid);
        //     }
        // };
        // tabsUpdate(d => {
        //     const index = d.findIndex(i => i.uid === uid);
        //     if (index > -1) {
        //         d.splice(index, 1);
        //         selectNextTab(index);
        //     }
        // });
        TerminalMessenger.closeTab(uid);
    };

    const selectTab = (uid: TerminalTabUid) => {
        selectedTabSet(uid);
    };

    const handleTerminalMsg = (msg: TerminalMsg) => {
        switch (msg.type) {
            case TerminalMsgType.TERMINAL_INSTANCES: {
                handleTabs(msg.tabs);
                break;
            }
            case TerminalMsgType.OUTPUT: {
                handleOutput(msg.uid, msg.data);
                break;
            }
            default: {
                console.log(msg);
            }
        }
    };

    const handleTabs = (tabs: TerminalTab[]) => { 
        refs.tabs = tabs;
        tabsUpdate(refs.tabs);
    };

    const handleOutput = (uid: TerminalTabUid, data: string) => {
        const process = termRefSet.get(uid);
        if (!process) {
            throw new Error('Terminal process not found. Process UID: ' + uid);
        }
        process.write(data);
    }

    useEffect(() => {
        // selectedTabSet(tabs[0].uid);
    }, []);

    useEffect(() => {
        TerminalMessenger.fetchTabs();
    }, []);


    useIpcMessage(IpcChannel.TERMINAL, (_ev: unknown, msg: unknown) => {
        handleTerminalMsg(msg as TerminalMsg);
    });

    // Handle window resize 
    useEffect(() => {
        const handleResize = () => {
            fitAddonRefSet.getValuesArray().forEach(v => {
                v?.fit();
            });
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            handleWindowKeyDown(e);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function handleWindowKeyDown(e: KeyboardEvent) {
        if (!e.shiftKey || !e.ctrlKey) {
            return;
        }
        switch (e.code) {
            case 'KeyC':
                requestCopy();
                break;
            case 'KeyV':
                requestPaste();
                break;
        }
    }

    function requestCopy() {
        const tab = refs.tabs[0];
        const term = termRefSet.get(tab.uid);
        if (!term) {
            throw new Error('Selected tab terminal was not found.');
        }
        const selection = term.getSelection();
        TerminalMessenger.requestCopy(tab.uid, selection);
    }

    function requestPaste() {
        const tab = refs.tabs[0];
        TerminalMessenger.requestPaste(tab.uid);
    }

    return (
        <appContext.Provider value={{
            tabs,
            selectedTab,
            wrapRefSet,
            termRefSet,
            fitAddonRefSet,
            createTab,
            closeTab,
            selectTab
        }}>
            {props.children}
        </appContext.Provider>
    )
}
