import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { TerminalInstance } from './TerminalInstance';
import { TerminalOutput } from '@common/types/TerminalOutput';


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
        this.sendOutput = this.sendOutput.bind(this);
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
        const instance = new TerminalInstance({
            sendOutput: this.sendOutput
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
                this.tInstance.sendLastOutput();
                break;
            }
            case TerminalMsgType.INPUT: {
                this.tInstance.write(msg.data);
                break;
            }
            case TerminalMsgType.RESIZE: {
                this.tInstance.resize(msg.cols,msg.rows);
                break;
            }
            case TerminalMsgType.CLEAR: {
                // this.tInstance.lastData = '';
                break;
            }
            case TerminalMsgType.FULL_SCREEN: {
                const isFullScreen = this.mainWindow!.fullScreen;
                this.mainWindow!.setFullScreen(!isFullScreen);
                break;
            }
        }
    }

    private sendOutput(output: TerminalOutput) {
        this.sendMsg({
            type: TerminalMsgType.OUTPUT,
            uid: output.uid,
            pwd: output.pwd,
            data: output.data
        });
    }

    private sendMsg(msg: TerminalMsg) {
        this.mainWindow!.webContents.send(IpcChannel.TERMINAL, msg);
    }
}