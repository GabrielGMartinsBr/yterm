import { PropsWithChildren } from 'react';
import FrameBar from './FrameBar';

export default function FrameView(props: PropsWithChildren) {
    return (
        <div
            className={`@tw{
                w-svw h-svh relative
                overflow-hidden rounded
                duration-0 transition-none
                border border-zinc-900

                flex flex-col gap-0
                justify-start items-start
            }`}
            style={{
                backgroundColor: 'rgba(33, 33, 33, .6)'
            }}
        >
            <FrameBar />
            <div
                className={`@tw{
                    w-full h-full relative
                }`}
            >
                {props.children}
            </div>
        </div>
    )
}
