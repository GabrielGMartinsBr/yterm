import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalProcess } from './TerminalProcess';

interface Callbacks {
    onProcessExit: () => void;
    sendOutput: (output: TerminalOutput) => void;
}

export class TerminalsManager {
    private tabs: Map<TerminalTabUid, TerminalTab>;
    private processes: Map<TerminalTabUid, TerminalProcess>;

    constructor(private callbacks: Callbacks) {
        this.tabs = new Map();
        this.processes = new Map();
        this.handleProcessExit = this.handleProcessExit.bind(this);
    }

    getProcess(uid: TerminalTabUid) {
        const process = this.processes.get(uid);
        return process;
    }

    getTabsArr() {
        return Array.from(this.tabs.values());
    }

    hasOpenedProcesses() {
        return this.processes.size > 0;
    }

    createTab() {
        const process = new TerminalProcess({
            ...this.callbacks,
            onExit: this.handleProcessExit
        });
        const tab = {
            uid: process.uid
        };
        this.processes.set(process.uid, process);
        this.tabs.set(process.uid, tab);
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
        this.tabs.delete(uid);
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