import { BrowserWindow, clipboard, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { MainServiceMsg, MainServiceMsgType } from '@common/ipcMsgs/MainServiceMsgs';
import { TerminalBService } from './Terminal.BackService';

export class MainService {

    static getInstance() {
        if (!this._instance) {
            this._instance = new MainService();
        }
        return this._instance;
    }

    static init(mainWindow: BrowserWindow) {
        return this.getInstance().init(mainWindow);
    }



    /*  
        Private 
    */

    private static _instance: MainService;
    private initialized: boolean;
    private mainWindow?: BrowserWindow;


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

    private listenIPC() {
        if (!this.initialized) {
            throw new Error('Service was not initialized yet.');
        }
        ipcMain.addListener(IpcChannel.MAIN, (_, msg) => {
            this.handleMessage(msg);
        });
    }

    private handleMessage(msg: MainServiceMsg) {
        switch (msg.type) {
            case MainServiceMsgType.COPY: {
                clipboard.writeText(msg.data, 'clipboard');
                break;
            }
            case MainServiceMsgType.REQUEST_PASTE: {
                this.sendPasteData();
                break;
            }
        }
    }

    private sendToRenderer(msg: MainServiceMsg) {
        if (!this.mainWindow) {
            throw new Error('MainWindow was not defined on MainService.');
        }
        this.mainWindow.webContents.send(IpcChannel.MAIN, msg);
    }

    private sendPasteData() {
        const data = clipboard.readText('selection');
        // this.sendToRenderer({
        //     type: MainServiceMsgType.PASTE,
        //     data
        // });
        TerminalBService.getInstance().tInstance!.write(data);
    }

}