import { useEffect } from 'react';
import { useRefSet3 } from '@renderer/hooks/useRefSet3';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useIpcMessage } from '@renderer/hooks/useIpcMessage';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalMsg, TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { useInstanceRef } from '@renderer/hooks/useInstanceRef';
import { MainServiceMsg, MainServiceMsgType } from '@common/ipcMsgs/MainServiceMsgs';


export default function TerminalMain() {
    const refs = useRefSet3(class {
        wrap: HTMLDivElement | null = null;
        term: Terminal | null = null;
        fitAddon: FitAddon | null = null;
    });
    const fns = useInstanceRef(class {
        requestCopy() {
            if (!refs.term) {
                return;
            }
            const { term } = refs;
            const selection = term.getSelection();
            window.api.pushMainServiceMsg({
                type: MainServiceMsgType.COPY,
                data: selection
            });
        }

        requestPaste() {
            if (!refs.term) {
                return;
            }
            window.api.pushMainServiceMsg({
                type: MainServiceMsgType.REQUEST_PASTE
            });
        }
    }, []);

    useEffect(() => {
        if (!refs.wrap) {
            return;
        }

        const term = new Terminal({
            allowTransparency: true,
            cols: 80,
            rows: 30,
            cursorStyle: 'block',
            fontSize: 14,

            theme: {
                background: 'rgba(33, 33, 33, 0)',
                foreground: '#fc6',
            },
            windowOptions: {
                fullscreenWin: true,
            },
        });

        term.onBinary(a => {
            console.log(a);
        })

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        refs.term = term;
        refs.fitAddon = fitAddon;

        term.open(refs.wrap);
        term.onKey(({ key, domEvent }) => {
            // console.log(key.charCodeAt(0), domEvent);
            if (domEvent.key === 'F11') {
                window.api.sendToTerminal({
                    type: TerminalMsgType.FULL_SCREEN
                });
            } else {
                send(key);
            }
        });

        let firstRender = true;
        term.onRender(() => {
            if (firstRender) {
                fitAddon.fit();
                emitInit();
                firstRender = false;
            }
        });

        term.onResize(({ cols, rows }) => {
            emitResize(cols, rows);
        });

        term.onData((data) => {
            if (data.charCodeAt(0) === 12) {
                emitClear();
            }
        })

        return () => {
            term.dispose();
            fitAddon.dispose();
            refs.term = null;
            refs.fitAddon = null;
        };
    }, []);

    useIpcMessage(IpcChannel.TERMINAL, (_, ...args: unknown[]) => {
        if (!refs.term) {
            return;
        }
        const msg = args[0] as TerminalMsg;
        if (!msg?.type) {
            throw new Error('Invalid main service msg received.');
        }
        if (msg.type === TerminalMsgType.OUTPUT) {
            refs.term!.write(msg.data);
        }
    });

    useIpcMessage(IpcChannel.MAIN, (_, ...args: unknown[]) => {
        if (!refs.term) {
            return;
        }
        const msg = args[0] as MainServiceMsg;
        if (!msg?.type) {
            throw new Error('Invalid main service msg received.');
        }
        if (msg.type === MainServiceMsgType.PASTE) {
            refs.term!.write(msg.data);
        }
    });

    useEffect(() => {
        const handleResize = () => {
            refs.fitAddon?.fit();
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.shiftKey || !e.ctrlKey) {
                return;
            }
            switch (e.code) {
                case 'KeyC':
                    fns().requestCopy();
                    break;
                case 'KeyV':
                    fns().requestPaste();
                    break;
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function emitInit() {
        window.api.sendToTerminal({
            type: TerminalMsgType.INIT
        });
    }

    function send(key: string) {
        window.api.sendToTerminal({
            type: TerminalMsgType.INPUT,
            data: key
        });
    }

    function emitResize(cols: number, rows: number) {
        window.api.sendToTerminal({
            type: TerminalMsgType.RESIZE,
            cols: cols,
            rows: rows
        });
    }

    function emitClear() {
        refs.term!.clear();
        window.api.sendToTerminal({
            type: TerminalMsgType.CLEAR
        });
    }

    return (
        <div className={`@tw{
            w-full h-screen
            flex flex-row px-1 py-2
            justify-stretch items-stretch
            overflow-hidden
        }`}>

            <div
                ref={refs.setter('wrap')}
                className={`@tw{
                    y-term-wrap
                    w-auto flex-1
                }`}
            />

        </div>
    )
}
