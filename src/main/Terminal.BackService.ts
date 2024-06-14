import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalInstance } from './TerminalInstance';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';

const dirMarkerRegex = /^DIR_MARKER:(.*)$\r\n/gm;
const setupCompleteMarker = 'SETUP_COMPLETE';
const setupCompleteMarkerRegex = /^SETUP_COMPLETE\r$/gm;

export class TerminalBService {
    static getInstance() {
        if (!this._instance) {
            this._instance = new TerminalBService();
        }
        return this._instance;
    }

    static init(mainWindow: BrowserWindow) {
        return this.getInstance().init(mainWindow);
    }


    /*  
        Private 
    */

    private static _instance: TerminalBService;

    private initialized: boolean;
    private mainWindow?: BrowserWindow;
    tInstance?: TerminalInstance;

    private constructor() {
        this.initialized = false;
    }

    private init(mainWindow: BrowserWindow) {
        if (this.initialized) {
            throw new Error('Service can not be initialized again.');
        }
        this.mainWindow = mainWindow;
        this.initialized = true;
        this.listenIPC();
    }

    private createInstance() {
        if (this.tInstance) {
            return;
        }
        const instance = new TerminalInstance();
        instance.write(`export PROMPT_COMMAND='echo -n "DIR_MARKER:"; pwd'\n`);
        instance.write(`echo "${setupCompleteMarker}"\n`);
        instance.process.onData(data => {
            this.handleTerminalData(data);
        });
        this.tInstance = instance;
    }

    private listenIPC() {
        if (!this.initialized) {
            throw new Error('Service was not initialized yet.');
        }
        ipcMain.addListener(IpcChannel.TERMINAL, (_, msg) => {
            this.handleMessage(msg);
        });
    }

    private handleMessage(msg: TerminalMsg) {
        if (!this.tInstance) {
            this.createInstance();
        }
        if (!this.tInstance) {
            throw new Error('Create terminal instance failed.');
        }
        switch (msg.type) {
            case TerminalMsgType.INIT: {
                this.sendLastOutput();
                break;
            }
            case TerminalMsgType.INPUT: {
                this.tInstance.write(msg.data);
                break;
            }
            case TerminalMsgType.RESIZE: {
                this.tInstance.process.resize(
                    msg.cols,
                    msg.rows
                );
                break;
            }
            case TerminalMsgType.CLEAR: {
                this.tInstance.lastData = '';
                break;
            }
            case TerminalMsgType.FULL_SCREEN: {
                const isFullScreen = this.mainWindow!.fullScreen;
                this.mainWindow!.setFullScreen(!isFullScreen);
                break;
            }
        }
    }

    private sendLastOutput() {
        if (!this.tInstance) {
            throw new Error('Terminal instance is not defined.');
        }
        const lastOutput = this.tInstance.lastData;
        this.mainWindow!.webContents.send(IpcChannel.TERMINAL, lastOutput);
    }

    private handleTerminalData(data: string) {
        if (!this.tInstance || !this.mainWindow) {
            throw new Error("tInstance or/and mainWindow was not defined.");
        }

        const result = dirMarkerRegex.exec(data);
        if (result) {
            console.log('dir:', result[1]);
            data = data.replace(dirMarkerRegex, '');
        }

        if (!this.tInstance.isSetupComplete) {
            const result2 = setupCompleteMarkerRegex.exec(data);
            if (result2) {
                const startIndex = result2.index + result2[0].length + 1;
                data = data.slice(startIndex);
                this.sendOutput(data);
                this.tInstance.isSetupComplete = true;
            }
            return;
        }

        this.sendOutput(data);
    }

    private sendOutput(data: string) {
        this.tInstance!.lastData += data;
        this.mainWindow!.webContents.send(IpcChannel.TERMINAL, data);
    }
}