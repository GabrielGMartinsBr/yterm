import { useEffect } from 'react';
import { useRefSet3 } from '@renderer/hooks/useRefSet3';
import { Terminal } from '@xterm/xterm';
import { useIpcMessage } from '@renderer/hooks/useIpcMessage';
import { IpcChannel } from '@common/IpcDefinitions';

export default function TerminalMain() {
    const refs = useRefSet3(class {
        wrap: HTMLDivElement | null = null;
        term: Terminal | null = null;
        cmd = '';
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
            window.api.sendToTerminal(key);
            // const code = key.charCodeAt(0);
            // if (code >= 32 && code < 127) {
            //     pushKey(key);
            //     send();
            //     return;
            // }
            // switch (key.charCodeAt(0)) {
            //     case 12:
            //         window.api.sendToTerminal(key);
            //         break;
            //     case 13:
            //         pushKey(key);
            //         send();
            //         break;
            //     case 127:
            //         term.write("\b \b");
            //         refs.cmd = refs.cmd.slice(0, refs.cmd.length - 1);
            //         break;
            //     default:
            //         window.api.sendToTerminal(key);
            //         // console.log(refs.cmd);
            //         console.log(key.charCodeAt(0));
            //         break;

            // }
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
        // console.log(msg);
        refs.term!.write(msg as string);
    });

    function pushKey(key: string) {
        refs.cmd += key;
        // refs.term!.write(key);
    }

    function send() {
        window.api.sendToTerminal(refs.cmd);
        refs.cmd = '';
    }

    return (
        <div className={`@tw{
            w-full py-12
            flex flex-row
            justify-center
        }`}>

            <div ref={refs.setter('wrap')}>

            </div>

        </div>
    )
}
