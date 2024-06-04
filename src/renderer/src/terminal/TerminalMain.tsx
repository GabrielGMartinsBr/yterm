import { useEffect } from 'react';
import { useRefSet3 } from '@renderer/hooks/useRefSet3';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useIpcMessage } from '@renderer/hooks/useIpcMessage';
import { IpcChannel } from '@common/IpcDefinitions';
import { TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';


export default function TerminalMain() {
    const refs = useRefSet3(class {
        wrap: HTMLDivElement | null = null;
        term: Terminal | null = null;
        fitAddon: FitAddon | null = null;
    });

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
                background: '#222223',
                foreground: '#fd6'
            },
            windowOptions: {
                fullscreenWin: true,
            }

        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        refs.term = term;
        refs.fitAddon = fitAddon;

        term.open(refs.wrap);
        term.onKey(({ key, domEvent }) => {
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

    useIpcMessage(IpcChannel.TERMINAL, (_, msg) => {
        if (!refs.term) {
            return;
        }
        refs.term!.write(msg as string);
    });

    useEffect(() => {
        const handleResize = () => {
            refs.fitAddon?.fit();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
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
            w-full
            flex flex-row
            justify-center
            bg-[#222]
        }`}>

            <div
                ref={refs.setter('wrap')}
                className={`@tw{
                    w-full h-screen
                }`}
            />

        </div>
    )
}
