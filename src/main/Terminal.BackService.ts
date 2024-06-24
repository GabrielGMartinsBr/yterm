import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { TerminalOutput } from '@common/types/TerminalOutput';
import { TerminalTabUid } from '@common/types/TerminalTab';
import { TerminalsManager } from './TerminalsManager';


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
    private terminalMng: TerminalsManager;

    private constructor() {
        this.initialized = false;
        this.sendOutput = this.sendOutput.bind(this);
        this.terminalMng = new TerminalsManager({
            sendOutput: this.sendOutput
        });
    }

    private init(mainWindow: BrowserWindow) {
        if (this.initialized) {
            throw new Error('Service can not be initialized again.');
        }
        this.mainWindow = mainWindow;
        this.initialized = true;
        this.listenIPC();
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
        switch (msg.type) {
            case TerminalMsgType.FETCH_TABS: {
                this.sendTabs();
                break;
            }
            case TerminalMsgType.CREATE_TAB: {
                this.createTab();
                break;
            }
            case TerminalMsgType.CLOSE_TAB: {
                this.closeTab(msg.uid);
                break;
            }

            // case TerminalMsgType.INIT: {
            //     this.tInstance.sendLastOutput();
            //     break;
            // }
            case TerminalMsgType.INPUT: {
                this.handleWrite(msg.uid, msg.data);
                break;
            }
            case TerminalMsgType.RESIZE: {
                this.handleResize(msg.uid, msg.cols, msg.rows);
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

    private handleWrite(uid: TerminalTabUid, data: string) {
        this.terminalMng.write(uid, data);
    }

    private handleResize(uid: TerminalTabUid, cols: number, rows: number) {
        console.log('resize', cols);
        this.terminalMng.resize(uid, cols, rows);
    }

    private sendTabs() {
        this.sendMsg({
            type: TerminalMsgType.TERMINAL_INSTANCES,
            tabs: this.terminalMng.tabs
        });
    }

    private createTab() {
        this.terminalMng.createTab();
        this.sendTabs();
    }

    private closeTab(uid: TerminalTabUid) {
        this.terminalMng.closeTab(uid);
        this.sendTabs();
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