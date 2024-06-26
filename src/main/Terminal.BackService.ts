import { BrowserWindow, app, clipboard, ipcMain } from 'electron';
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
        this.handleProcessExit = this.handleProcessExit.bind(this);
        this.sendOutput = this.sendOutput.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.terminalMng = new TerminalsManager({
            onProcessExit: this.handleProcessExit,
            sendOutput: this.sendOutput,
            onTabChange: this.handleTabChange
        });
    }

    private init(mainWindow: BrowserWindow) {
        if (this.initialized) {
            throw new Error('Service can not be initialized again.');
        }
        this.mainWindow = mainWindow;
        this.initialized = true;
        this.listenIPC();
        this.initSession();
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
            case TerminalMsgType.INIT_FETCH: {
                this.sendTabs();
                this.sendSelectedTab();
                // this.tInstance.sendLastOutput();
                break;
            }
            case TerminalMsgType.FETCH_TABS: {
                this.sendTabs();
                break;
            }
            case TerminalMsgType.CREATE_TAB: {
                this.createTab();
                break;
            }
            case TerminalMsgType.SELECT_TAB: {
                this.selectTab(msg.uid);
                break;
            }
            case TerminalMsgType.CLOSE_TAB: {
                this.closeTab(msg.uid);
                break;
            }

            case TerminalMsgType.INPUT: {
                this.handleWrite(msg.uid, msg.data);
                break;
            }
            case TerminalMsgType.COPY: {
                this.clipboardCopy(msg.data);
                break;
            }
            case TerminalMsgType.PASTE: {
                this.clipboardPaste(msg.uid);
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

    private handleTabChange() {
        this.sendTabs();
    }

    private handleWrite(uid: TerminalTabUid, data: string) {
        this.terminalMng.write(uid, data);
    }

    private handleResize(uid: TerminalTabUid, cols: number, rows: number) {
        this.terminalMng.resize(uid, cols, rows);
    }

    private handleProcessExit() {
        if (this.terminalMng.hasOpenedProcesses()) {
            this.sendTabs();
            this.sendSelectedTab();
        } else {
            app.quit();
        }
    }

    private async initSession() {
        await this.terminalMng.init();
        this.sendTabs();
        this.sendSelectedTab();
    }

    private sendTabs() {
        this.sendMsg({
            type: TerminalMsgType.TABS,
            tabs: this.terminalMng.getTabsArr()
        });
    }

    private sendSelectedTab() {
        this.sendMsg({
            type: TerminalMsgType.SELECTED_TAB,
            uid: this.terminalMng.getSelectedTab()
        });
    }

    private createTab() {
        this.terminalMng.createTab();
        this.sendTabs();
        this.sendSelectedTab();
    }

    private selectTab(uid: TerminalTabUid) {
        this.terminalMng.selectTab(uid);
        this.sendSelectedTab();
    }

    private closeTab(uid: TerminalTabUid) {
        this.terminalMng.closeTab(uid);
        this.sendTabs();
        this.sendSelectedTab();
    }

    private sendOutput(output: TerminalOutput) {
        this.sendMsg({
            type: TerminalMsgType.OUTPUT,
            uid: output.uid,
            cwd: output.cwd,
            data: output.data
        });
    }

    private sendMsg(msg: TerminalMsg) {
        this.mainWindow!.webContents.send(IpcChannel.TERMINAL, msg);
    }

    private clipboardCopy(data: string) {
        clipboard.writeText(data, 'clipboard');
    }

    private clipboardPaste(uid: TerminalTabUid) {
        const data = clipboard.readText('selection');
        const process = this.terminalMng.getProcess(uid);
        if (!process) {
            throw new Error('Terminal process was not found. Process UID: ' + uid);
        }
        process.write(data);
    }
}