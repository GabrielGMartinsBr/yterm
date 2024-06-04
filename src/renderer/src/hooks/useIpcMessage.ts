import { useEffect } from 'react';
import { useRefSet3 } from './useRefSet3';

type Listener = (...args: unknown[]) => void;

export function useIpcMessage(channel: string, listener: Listener) {
    const refs = useRefSet3(class {
        listener: Listener | undefined;
    });

    useEffect(() => {
        refs.listener = listener;
    }, [listener]);

    useEffect(() => {
        const { ipcRenderer } = window.electron;
        const cleanup = ipcRenderer.on(channel, (...args: unknown[]) => {
            if (refs.listener) {
                refs.listener(...args);
            }
        });
        return () => {
            cleanup();
        };
    }, []);
}