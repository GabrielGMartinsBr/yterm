import os from 'node:os';
import { nanoid } from 'nanoid';
import pty from 'node-pty';


export class TerminalInstance {
    readonly uid: string;
    process: pty.IPty;
    lastData: string;
    isSetupComplete: boolean;

    constructor() {
        this.uid = nanoid();
        this.process = this.createProcess();
        this.lastData = '';
        this.isSetupComplete = false;
    }

    write(cmd: string) {
        this.process.write(cmd);
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

}