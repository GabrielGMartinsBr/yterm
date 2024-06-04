import { useEffect } from 'react';
import { useRefSet3 } from './useRefSet3';

type Listener = (...args: any) => any;

export function useIpcMessage(channel: string, listener: Listener) {
    const refs = useRefSet3(class {
        listener: Listener | undefined;
    });

    useEffect(() => {
        refs.listener = listener;
    }, [listener]);

    useEffect(() => {
        const { ipcRenderer } = window.electron;
        const cleanup = ipcRenderer.on(channel, (...args: any) => {
            if (refs.listener) {
                refs.listener(...args);
            }
        });
        return () => {
            cleanup();
        };
    }, []);
}