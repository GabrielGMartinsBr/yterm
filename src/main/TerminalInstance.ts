import os from 'node:os';
import pty from 'node-pty';


export class TerminalInstance {
    process: pty.IPty;

    constructor() {
        this.process = this.createProcess();
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