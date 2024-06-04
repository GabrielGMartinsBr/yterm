import { IoClose } from 'react-icons/io5';
interface Props {
    onClick: () => void;
}

export function ModalCloseButton(props: Props) {
    return (
        <button
            onClick={props.onClick}
            className={`@tw{
                absolute right-0 top-0 p-3
                md:right-3 md:top-3 rounded-full
                text-lg text-rms-black/90
                text-zinc-700
                outline-none
                ring-zinc-500
                shadow-sm
                
                transition-shadow
                ease-in duration-200
                
                focus-visible:ring-2
                hover:{
                    text-zinc-900
                    shadow-md
                }
            }`}
        >
            <IoClose />
        </button>
    )
}