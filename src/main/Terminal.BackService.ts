import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalInstance } from './TerminalInstance';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';

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
    private tInstance?: TerminalInstance;

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
        instance.process.onData(data => {
            instance.lastData += data;
            this.mainWindow!.webContents.send(IpcChannel.TERMINAL, data);
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

}