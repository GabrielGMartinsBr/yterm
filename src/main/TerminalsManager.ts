import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalProcess } from './TerminalProcess';

interface Callbacks {
    onProcessExit: () => void;
    sendOutput: (output: TerminalOutput) => void;
}

export class TerminalsManager {
    tabs: TerminalTab[];
    private processes: TerminalProcess[];

    constructor(private callbacks: Callbacks) {
        this.tabs = [];
        this.processes = [];
        this.handleProcessExit = this.handleProcessExit.bind(this);
    }

    getProcess(uid: TerminalTabUid) {
        const process = this.processes.find(i => i.uid === uid);
        return process;
    }

    hasOpenedProcesses() {
        return this.processes.length > 0;
    }

    createTab() {
        const process = new TerminalProcess({
            ...this.callbacks,
            onExit: this.handleProcessExit
        });
        const tab = {
            uid: process.uid
        };
        this.processes.push(process);
        this.tabs.push(tab);
    }

    closeTab(uid: TerminalTabUid) {
        this.removeTabEntry(uid);
        this.killTerminalProcess(uid);
    }

    write(uid: TerminalTabUid, data: string) {
        const process = this.processes.find(i => i.uid === uid);
        if (!process) {
            throw new Error('Terminal process not found. Process UID: ' + uid);
        }
        process.write(data);
    }

    resize(uid: TerminalTabUid, cols: number, rows: number) {
        const process = this.processes.find(i => i.uid === uid);
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
        const index = this.processes.findIndex(i => i.uid === uid);
        const founded = index !== -1;
        if (founded) {
            this.processes.splice(index, 1);
        }
    }

    /** Close tab */

    private removeTabEntry(uid: TerminalTabUid) {
        const index = this.tabs.findIndex(i => i.uid === uid);
        const founded = index !== -1;
        if (founded) {
            this.tabs.splice(index, 1);
        }
    }

    private killTerminalProcess(uid: TerminalTabUid) {
        const index = this.processes.findIndex(i => i.uid === uid);
        const founded = index !== -1;
        if (founded) {
            const process = this.processes[index];
            process.kill();
            this.processes.splice(index, 1);
        }
    }



}