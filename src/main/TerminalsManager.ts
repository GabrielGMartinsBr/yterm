import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalProcess } from './TerminalProcess';

interface Callbacks {
    sendOutput: (output: TerminalOutput) => void;
}

export class TerminalsManager {
    tabs: TerminalTab[];
    processes: TerminalProcess[];

    constructor(private callbacks: Callbacks) {
        this.tabs = [];
        this.processes = [];
    }

    getProcess(uid: TerminalTabUid) {
        const process = this.processes.find(i => i.uid === uid);
        return process;
    }

    createTab() {
        const process = new TerminalProcess(this.callbacks);
        const tab = {
            uid: process.uid
        };
        this.processes.push(process);
        this.tabs.push(tab);
    }

    closeTab(uid: TerminalTabUid) {
        const index = this.tabs.findIndex(i => i.uid === uid);
        if (index !== -1) {
            this.tabs.splice(index, 1);
        }
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

}