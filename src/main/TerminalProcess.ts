import os from 'node:os';
import { nanoid } from 'nanoid';
import pty from 'node-pty';
import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTabUid } from '@common/types/TerminalTab';

interface Callbacks {
    onExit: (uid: TerminalTabUid) => void;
    sendOutput: (output: TerminalOutput) => void;
    onPwdChange: (uid: TerminalTabUid, pwd: string) => void;
}

const dirMarkerRegex = /^DIR_MARKER:(.*)$\r\n/gm;
const setupCompleteMarker = 'SETUP_COMPLETE';
const setupCompleteMarkerRegex = /^SETUP_COMPLETE\r$/gm;

export class TerminalProcess {
    readonly uid: string;

    private pwd: string;
    private process: pty.IPty;
    private isSetupComplete: boolean;
    private isExited: boolean;
    private lastData: string;

    constructor(private callbacks: Callbacks) {
        this.uid = nanoid();
        this.pwd = '';
        this.process = this.createProcess();
        this.lastData = '';
        this.isSetupComplete = false;
        this.isExited = false;
        this.setup();
        this.bindCloseEvent();
    }

    static newInstance(callbacks: Callbacks) {
        const instance = new TerminalProcess(callbacks);
        return instance;
    }

    getPwd() {
        return this.pwd;
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
            cwd: process.env.HOME,
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
            this.handlePwd(result[1]);
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

    private handlePwd(pwd: string) {
        if (this.pwd === pwd) {
            return;
        }
        this.pwd = pwd;
        this.callbacks.onPwdChange(this.uid, this.pwd);
    }

    private sendOutput(data: string) {
        this.callbacks.sendOutput({
            uid: this.uid,
            pwd: this.pwd,
            data
        });
    }

    private throwErrorIfIsExited() {
        if (this.isExited) {
            throw new Error('Terminal process is exited.');
        }
    }

}