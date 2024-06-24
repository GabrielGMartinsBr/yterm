import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { MainServiceMsg, MainServiceMsgType } from '@common/ipcMsgs/MainServiceMsgs';

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
            case MainServiceMsgType.MINIMIZE: {
                this.minimize();
                break;
            }
            case MainServiceMsgType.TOGGLE_MAXIMIZE: {
                this.toggleMaximize();
                break;
            }
            case MainServiceMsgType.CLOSE: {
                this.close();
                break;
            }
        }
    }

    private minimize() {
        if (!this.mainWindow) {
            throw new Error('MainWindow not defined.');
        }
        this.mainWindow.minimize();
    }

    private toggleMaximize() {
        if (!this.mainWindow) {
            throw new Error('MainWindow not defined.');
        }
        if (this.mainWindow.isMaximized()) {
            this.mainWindow.restore();
        } else {
            this.mainWindow.maximize();
        }
    }

    private close() {
        if (!this.mainWindow) {
            throw new Error('MainWindow not defined.');
        }
        this.mainWindow.close();
    }

}