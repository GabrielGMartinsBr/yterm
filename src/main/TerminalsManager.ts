import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalProcess } from './TerminalProcess';

interface Callbacks {
    onProcessExit: () => void;
    onTabChange: () => void;
    sendOutput: (output: TerminalOutput) => void;
}

export class TerminalsManager {
    private tabs: TerminalTab[];
    private tabsMap: Map<TerminalTabUid, TerminalTab>;
    private processes: Map<TerminalTabUid, TerminalProcess>;
    private selectedTab: TerminalTabUid | null;

    constructor(private callbacks: Callbacks) {
        this.tabs = [];
        this.tabsMap = new Map();
        this.processes = new Map();
        this.selectedTab = null;
        this.handleProcessExit = this.handleProcessExit.bind(this);
        this.handlePwdChange = this.handlePwdChange.bind(this);
    }

    getProcess(uid: TerminalTabUid) {
        const process = this.processes.get(uid);
        return process;
    }

    getTabsArr() {
        return this.tabs;
    }

    getSelectedTab() {
        return this.selectedTab;
    }

    hasOpenedProcesses() {
        return this.processes.size > 0;
    }

    createTab() {
        const process = new TerminalProcess({
            ...this.callbacks,
            onExit: this.handleProcessExit,
            onPwdChange: this.handlePwdChange
        });
        const tab: TerminalTab = {
            uid: process.uid,
            pwd: process.getPwd()
        };
        this.tabs.push(tab);
        this.tabsMap.set(process.uid, tab);
        this.processes.set(process.uid, process);
        this.selectTab(process.uid);
    }

    selectTab(uid: TerminalTabUid) {
        this.selectedTab = uid;
    }

    closeTab(uid: TerminalTabUid) {
        this.removeTabEntry(uid);
        this.killTerminalProcess(uid);
    }

    write(uid: TerminalTabUid, data: string) {
        const process = this.processes.get(uid);
        if (!process) {
            throw new Error('Terminal process not found. Process UID: ' + uid);
        }
        process.write(data);
    }

    resize(uid: TerminalTabUid, cols: number, rows: number) {
        const process = this.processes.get(uid);
        if (!process) {
            throw new Error('Terminal process not found. Process UID: ' + uid);
        }
        process.resize(cols, rows);
    }

    private handlePwdChange(uid: TerminalTabUid, pwd: string) {
        const tab = this.tabsMap.get(uid);
        if (!tab) {
            console.error('Not found tab uid:', uid);
            throw new Error('Terminal tab reference was not found on tabsMap.');
        }
        tab.pwd = pwd;
        this.callbacks.onTabChange();
    }


    /** Process exit */

    private handleProcessExit(uid: TerminalTabUid) {
        this.removeTabEntry(uid);
        this.removeProcess(uid);
        this.callbacks.onProcessExit();
    }

    private removeProcess(uid: TerminalTabUid) {
        this.processes.delete(uid);
    }


    /** Close tab */

    private removeTabEntry(uid: TerminalTabUid) {
        const index = this.tabs.findIndex(i => i.uid === uid);
        const founded = index !== -1;
        if (founded) {
            this.tabs.splice(index, 1);
        }
        this.tabsMap.delete(uid);
    }

    private killTerminalProcess(uid: TerminalTabUid) {
        const process = this.processes.get(uid);
        const founded = !!process;
        if (founded) {
            process.kill();
            this.processes.delete(uid);
        }
    }

}