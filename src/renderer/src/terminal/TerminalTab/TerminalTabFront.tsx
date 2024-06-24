import { useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import { TerminalTabUid } from '@common/types/TerminalTab'
import { useAppContext } from '@renderer/AppContext';
import { TerminalMsgType } from '@common/ipcMsgs/TerminalMsgs';
import { TerminalMessenger } from '../TerminalMessenger';

interface Props {
    uid: TerminalTabUid;
}

export default function TerminalTabFront(props: Props) {
    const { wrapRefSet, termRefSet, fitAddonRefSet } = useAppContext();


    useEffect(() => {
        const wrap = wrapRefSet.get(props.uid);
        if (!wrap) {
            return;
        }

        wrap.textContent = props.uid;

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

        termRefSet.set(props.uid, term);
        fitAddonRefSet.set(props.uid, fitAddon);

        term.open(wrap);
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
                // emitInit();
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

        console.log(wrapRefSet.getObjectMap());
        console.log(termRefSet.getObjectMap());

        return () => {
            term.dispose();
            fitAddon.dispose();
            termRefSet.set(props.uid, null);
            fitAddonRefSet.set(props.uid, null);
        };
    }, []);

    function send(key: string) {
        TerminalMessenger.send(props.uid, key);
    }

    function emitClear() {
        const term = termRefSet.get(props.uid);
        term!.clear();
        TerminalMessenger.emitClear(props.uid);
    }

    function emitResize(cols: number, rows: number) {
        TerminalMessenger.emitResize(props.uid, cols, rows);
    }

    return (
        <div
            ref={wrapRefSet.setter(props.uid)}
            className={`@tw{
                y-term-wrap w-auto flex-1
            }`}
        />
    )
}
