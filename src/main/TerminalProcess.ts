import os from 'node:os';
import { nanoid } from 'nanoid';
import pty from 'node-pty';
import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';

interface Callbacks {
    onExit: (uid: TerminalTabUid) => void;
    sendOutput: (output: TerminalOutput) => void;
    onCwdChange: (uid: TerminalTabUid, cwd: string) => void;
}

const dirMarkerRegex = /^DIR_MARKER:(.*)$\r\n/gm;
const setupCompleteMarker = 'SETUP_COMPLETE';
const setupCompleteMarkerRegex = /^SETUP_COMPLETE\r$/gm;

export class TerminalProcess {
    readonly uid: string;

    private process: pty.IPty;
    private isSetupComplete: boolean;
    private isExited: boolean;
    private lastData: string;

    constructor(uid: TerminalTabUid, private cwd: string | undefined, private callbacks: Callbacks) {
        this.uid = uid;
        this.process = this.createProcess();
        this.lastData = '';
        this.isSetupComplete = false;
        this.isExited = false;
        this.setup();
        this.bindCloseEvent();
    }

    static newInstance(callbacks: Callbacks) {
        const uid = nanoid();
        const cwd = process.env.HOME;
        const instance = new TerminalProcess(uid, cwd, callbacks);
        return instance;
    }

    static restoreInstance(tab: TerminalTab, callbacks: Callbacks) {
        const instance = new TerminalProcess(tab.uid, tab.cwd, callbacks);
        return instance;
    }

    getCwd() {
        return this.cwd;
    }

    write(cmd: string) {
        this.throwErrorIfIsExited();
        this.process.write(cmd);
    }

    sendLastOutput() {
        this.sendOutput(this.lastData);
    }

    resize(cols: number, rows: number) {
        this.throwErrorIfIsExited();
        this.process.resize(cols, rows);
    }

    kill(signal?: string) {
        this.process.kill(signal);
    }

    private createProcess() {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
        return pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: this.cwd || undefined,
            env: process.env,
        });
    }

    private setup() {
        this.process.onData(data => {
            this.handleTerminalData(data);
        });
        this.process.write(`export PROMPT_COMMAND='echo -n "DIR_MARKER:"; pwd'\n`);
        this.process.write(`echo "${setupCompleteMarker}"\n`);
    }

    private bindCloseEvent() {
        this.process.onExit(() => {
            this.isExited = true;
            this.callbacks.onExit(this.uid);
        });
    }

    private handleTerminalData(data: string) {
        const result = dirMarkerRegex.exec(data);
        if (result) {
            this.handleCwd(result[1]);
            data = data.replace(dirMarkerRegex, '');
        }

        if (!this.isSetupComplete) {
            const result2 = setupCompleteMarkerRegex.exec(data);
            if (result2) {
                const startIndex = result2.index + result2[0].length + 1;
                data = data.slice(startIndex);
                this.lastData += data;
                this.sendOutput(data);
                this.isSetupComplete = true;
            }
            return;
        }

        this.lastData += data;
        this.sendOutput(data);
    }

    private handleCwd(cdw: string) {
        if (this.cwd === cdw) {
            return;
        }
        this.cwd = cdw;
        this.callbacks.onCwdChange(this.uid, this.cwd);
    }

    private sendOutput(data: string) {
        this.callbacks.sendOutput({
            uid: this.uid,
            cwd: this.cwd,
            data
        });
    }

    private throwErrorIfIsExited() {
        if (this.isExited) {
            throw new Error('Terminal process is exited.');
        }
    }

}