import os from 'node:os';
import { nanoid } from 'nanoid';
import pty from 'node-pty';
import { TerminalOutput } from '@common/types/TerminalOutput';

interface Callbacks {
    sendOutput: (output: TerminalOutput) => void;
}

const dirMarkerRegex = /^DIR_MARKER:(.*)$\r\n/gm;
const setupCompleteMarker = 'SETUP_COMPLETE';
const setupCompleteMarkerRegex = /^SETUP_COMPLETE\r$/gm;

export class TerminalProcess {
    readonly uid: string;

    private pwd: string;
    private process: pty.IPty;
    private isSetupComplete: boolean;
    private lastData: string;

    constructor(private callbacks: Callbacks) {
        this.uid = nanoid();
        this.pwd = '';
        this.process = this.createProcess();
        this.lastData = '';
        this.isSetupComplete = false;
        this.setup();
    }

    static newInstance(callbacks: Callbacks) {
        const instance = new TerminalProcess(callbacks);
        return instance;
    }

    write(cmd: string) {
        this.process.write(cmd);
    }

    sendLastOutput() {
        this.sendOutput(this.lastData);
    }

    resize(cols: number, rows: number) {
        this.process.resize(cols, rows);
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

    private handleTerminalData(data: string) {
        const result = dirMarkerRegex.exec(data);
        if (result) {
            this.pwd = result[1];
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

    private sendOutput(data: string) {
        console.log(data);
        this.callbacks.sendOutput({
            uid: this.uid,
            pwd: this.pwd,
            data
        });
    }

}