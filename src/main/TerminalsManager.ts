import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalProcess } from './TerminalProcess';
import { AppStorage } from './AppStorage';

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
        this.handleCwdChange = this.handleCwdChange.bind(this);
    }

    async init() {
        const restored = await this.restorePreviousSession();
        if (!restored) {
            this.createNewSession();
        }
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
        const process = TerminalProcess.newInstance({
            ...this.callbacks,
            onExit: this.handleProcessExit,
            onCwdChange: this.handleCwdChange
        });
        const tab: TerminalTab = {
            uid: process.uid,
            cwd: process.getCwd()
        };
        this.tabs.push(tab);
        this.tabsMap.set(process.uid, tab);
        this.processes.set(process.uid, process);
        this.selectTab(process.uid);
        this.saveSession();
    }

    selectTab(uid: TerminalTabUid) {
        this.selectedTab = uid;
        this.saveSession();
    }

    closeTab(uid: TerminalTabUid) {
        this.removeTabEntry(uid);
        this.killTerminalProcess(uid);
        this.saveSession();
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

    private handleCwdChange(uid: TerminalTabUid, cwd: string) {
        const tab = this.tabsMap.get(uid);
        if (!tab) {
            console.error('Not found tab uid:', uid);
            throw new Error('Terminal tab reference was not found on tabsMap.');
        }
        tab.cwd = cwd;
        this.callbacks.onTabChange();
        this.saveSession();
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
        if (this.selectedTab === uid) {
            this.selectNextTab(index);
        }
    }

    private killTerminalProcess(uid: TerminalTabUid) {
        const process = this.processes.get(uid);
        const founded = !!process;
        if (founded) {
            process.kill();
            this.processes.delete(uid);
        }
    }

    private selectNextTab(index: number) {
        let nextTab = this.tabs[index];
        if (!nextTab && index > 0) {
            nextTab = this.tabs[index - 1];
        }
        if (!nextTab && index > 0) {
            nextTab = this.tabs[0];
        }
        if (nextTab) {
            this.selectTab(nextTab.uid);
        }
    }


    /** Save and Restore previous sessions */

    private saveSession() {
        const tabs = this.tabs;
        const selectedTab = this.selectedTab;
        AppStorage.save({
            tabs,
            selectedTab
        });
    }

    private async restorePreviousSession() {
        const previous = await AppStorage.load();
        if (!previous?.tabs.length) {
            return false;
        }
        for (const tab of previous.tabs) {
            this.restoreTab(tab);
        }
        if (previous.selectedTab) {
            this.selectedTab = previous.selectedTab;
        } else {
            this.selectedTab = previous.tabs[0].uid;
        }
        return true;
    }

    private createNewSession() {
        this.createTab();
        const tab = this.getTabsArr()[0];
        if (!tab) {
            throw new Error('Failed to create first tab.');
        }
        this.selectTab(tab.uid);
    }

    private restoreTab(_tab: TerminalTab) {
        const tab: TerminalTab = {
            uid: _tab.uid,
            cwd: _tab.cwd
        };
        const process = TerminalProcess.restoreInstance(tab, {
            ...this.callbacks,
            onExit: this.handleProcessExit,
            onCwdChange: this.handleCwdChange
        })
        this.tabs.push(tab);
        this.tabsMap.set(process.uid, tab);
        this.processes.set(process.uid, process);
    }

}