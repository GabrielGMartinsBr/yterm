import { useEffect } from 'react';
import { useRefSet3 } from '@renderer/hooks/useRefSet3';
import { Terminal } from '@xterm/xterm';

export default function TerminalMain() {
    const refs = useRefSet3(class {
        wrap: HTMLDivElement | null = null;
    });

    useEffect(() => {
        if (!refs.wrap) {
            return;
        }

        const term = new Terminal({
            allowTransparency: true,
        });
        term.open(refs.wrap);


        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
        term.onKey(({ key }) => {
            // console.log(key.charCodeAt(0), key.length);
            switch (key.charCodeAt(0)) {
                case 13:
                    term.write("\r");
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

        return () => {
            term.dispose();
        };
    }, []);

    return (
        <div>

            <div ref={refs.setter('wrap')}>

            </div>

        </div>
    )
}
