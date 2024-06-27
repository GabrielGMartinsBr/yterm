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
import { useInstanceRef } from './hooks/useInstanceRef';

export default function AppCtrl(props: PropsWithChildren) {
    const refs = useRefSet3(class {
        tabs: TerminalTab[] = [];
        selectedTab: TerminalTabUid | null = null;
    });
    const wrapRefSet = useRefSet4<HTMLDivElement | null>();
    const termRefSet = useRefSet4<Terminal | null>();
    const fitAddonRefSet = useRefSet4<FitAddon | null>();

    const [tabs, tabsUpdate] = useImmer<TerminalTab[]>([]);
    const [selectedTab, selectedTabUpdate] = useState<SelectedTab | null>(null);

    const methods = useInstanceRef(class {
        handleResize() {
            fitAddonRefSet.getValuesArray().forEach(v => {
                v?.fit();
            });
        };

        handleWindowKeyDown(e: KeyboardEvent) {
            if (!e.shiftKey || !e.ctrlKey) {
                return;
            }
            switch (e.code) {
                case 'KeyC':
                    this.requestCopy();
                    break;
                case 'KeyV':
                    this.requestPaste();
                    break;
            }
        }

        handleTerminalMsg = (msg: TerminalMsg) => {
            switch (msg.type) {
                case TerminalMsgType.TABS: {
                    this.handleTabs(msg.tabs);
                    break;
                }
                case TerminalMsgType.SELECTED_TAB: {
                    this.handleSelectedTab(msg.uid);
                    break;
                }
                case TerminalMsgType.OUTPUT: {
                    this.handleOutput(msg.uid, msg.data);
                    break;
                }
                default: {
                    console.log(msg);
                }
            }
        };

        handleTabs(tabs: TerminalTab[]) {
            refs.tabs = tabs;
            tabsUpdate(refs.tabs);
        };

        handleSelectedTab(uid: TerminalTabUid | null) {
            refs.selectedTab = uid;
            selectedTabUpdate(refs.selectedTab);
        };

        handleOutput(uid: TerminalTabUid, data: string) {
            const process = termRefSet.get(uid);
            if (!process) {
                throw new Error('Terminal process not found on handleOutput method. Process UID: ' + uid);
            }
            process.write(data);
        }

        createTab() {
            TerminalMessenger.createTab();
        };

        closeTab(uid: TerminalTabUid) {
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

        selectTab(uid: TerminalTabUid) {
            TerminalMessenger.selectTab(uid);
        };

        requestCopy() {
            const tab = refs.tabs[0];
            const term = termRefSet.get(tab.uid);
            if (!term) {
                throw new Error('Selected tab terminal was not found.');
            }
            const selection = term.getSelection();
            TerminalMessenger.requestCopy(tab.uid, selection);
        }

        requestPaste() {
            const tab = refs.tabs[0];
            TerminalMessenger.requestPaste(tab.uid);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            methods().handleResize();
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            methods().handleWindowKeyDown(e);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useIpcMessage(IpcChannel.TERMINAL, (_ev: unknown, msg: unknown) => {
        methods().handleTerminalMsg(msg as TerminalMsg);
    });


    useEffect(() => {
        TerminalMessenger.fetchTabs();
    }, []);

    useEffect(() => {
        if (!selectedTab) {
            return;
        }
        const term = termRefSet.get(selectedTab);
        term?.focus();
    }, [selectedTab]);

    return (
        <appContext.Provider value={{
            tabs,
            selectedTab,
            wrapRefSet,
            termRefSet,
            fitAddonRefSet,
            createTab: methods().createTab,
            closeTab: methods().closeTab,
            selectTab: methods().selectTab
        }}>
            {props.children}
        </appContext.Provider>
    )
}
