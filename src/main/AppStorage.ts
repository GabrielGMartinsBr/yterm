import { TerminalTab, TerminalTabUid } from '@common/types/TerminalTab';
import fs from 'node:fs';
import path from 'node:path';

const STORAGE_DIR = '.storage';
const TABS_FILE_NAME = 'tabs.storage';

const TABS_STORAGE_PATH = path.join(STORAGE_DIR, TABS_FILE_NAME);

interface TabsStorage {
    tabs: TerminalTab[];
    selectedTab: TerminalTabUid | null;
}

export class AppStorage {
    static lastData: string = '';

    static save(value: TabsStorage) {
        const str = JSON.stringify(value);
        if (this.lastData === str) {
            return;
        }
        this.lastData = str;
        this.write();
        console.log(str);
    }

    static async load(): Promise<TabsStorage | null> {
        const strData = await this.read();
        if (!strData) {
            return null;
        }
        try {
            const obj = JSON.parse(strData);
            if (typeof obj === 'object' && Array.isArray(obj.tabs)) {
                return obj as TabsStorage;
            }
        } catch (ex) {
            console.error('Failed to read last session storage data.');
            console.error(ex);
        }
        return null;
    }

    private static async write() {
        await fs.promises.mkdir(STORAGE_DIR, { recursive: true });
        await fs.promises.writeFile(TABS_STORAGE_PATH, this.lastData);
    }

    private static async read() {
        const stat = await fs.promises.stat(TABS_STORAGE_PATH);
        if (stat?.size > 0) {
            const buff = await fs.promises.readFile(TABS_STORAGE_PATH);
            return buff.toString();
        }
        return null;
    }

}