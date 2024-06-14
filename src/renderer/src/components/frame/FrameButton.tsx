import { PropsWithChildren } from 'react';

interface Props {
    onClick?: () => void;
}

export default function FrameButton(props: PropsWithChildren<Props>) {
    return (
        <button
            className={`@tw{
                app-no-drag-area
                px-1.5 py-1.5
                border border-transparent rounded-md
                hover:border-orange-300
                transition-colors duration-150
                cursor-default
            }`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}
