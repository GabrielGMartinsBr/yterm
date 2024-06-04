import { BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalInstance } from './TerminalInstance';

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
        this.tInstance = new TerminalInstance();
        this.tInstance.process.onData(data => {
            this.mainWindow?.webContents.send(IpcChannel.TERMINAL, data); 
        });
    }

    private listenIPC() {
        if (!this.initialized) {
            throw new Error('Service was not initialized yet.');
        }
        ipcMain.addListener(IpcChannel.TERMINAL, (_, msg) => {
            this.handleMessage(msg);
        });
    }

    private handleMessage(msg: string) {
        console.log({ msg });
        if (!this.tInstance) {
            this.createInstance();
        } else {
            this.tInstance.test();
        }
        // this.tInstance.test();
    }

}