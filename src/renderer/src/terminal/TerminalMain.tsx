import { useEffect } from 'react';
import { useRefSet3 } from '@renderer/hooks/useRefSet3';
import { Terminal } from '@xterm/xterm';
import { useIpcMessage } from '@renderer/hooks/useIpcMessage';
import { IpcChannel } from '@common/IpcDefinitions';

export default function TerminalMain() {
    const refs = useRefSet3(class {
        wrap: HTMLDivElement | null = null;
        term: Terminal | null = null;
    });

    useEffect(() => {
        if (!refs.wrap) {
            return;
        }

        const term = new Terminal({
            allowTransparency: true,
        });
        term.open(refs.wrap);


        // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
        term.onKey(({ key }) => {
            // console.log(key.charCodeAt(0), key.length);
            switch (key.charCodeAt(0)) {
                case 13:
                    window.api.sendToTerminal('init');
                    break;
                case 127:
                    term.write("\b \b");
                    break;
                default:
                    term.write(key);
                    console.log(key.charCodeAt(0));
                    break;

            }
        })

        refs.term = term;

        return () => {
            term.dispose();
            refs.term = null;
        };
    }, []);

    useIpcMessage(IpcChannel.TERMINAL, (_, msg) => {
        if (!refs.term) {
            return;
        }
        console.log(msg);
        refs.term.write(msg as string);
    });

    return (
        <div>

            <div ref={refs.setter('wrap')}>

            </div>

        </div>
    )
}
