import { PropsWithChildren } from 'react';
import FrameBar from './FrameBar';

export default function FrameView(props: PropsWithChildren) {
    return (
        <div
            className={`@tw{
                w-svw h-svh 
                overflow-hidden
                duration-0 transition-none
                border border-zinc-900
            }`}
            style={{
                backgroundColor: 'rgba(33, 33, 33, .6)'
            }}
        >
            <FrameBar />
            <div>
                {props.children}
            </div>
        </div>
    )
}
