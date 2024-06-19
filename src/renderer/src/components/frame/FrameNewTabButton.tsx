import { IoAdd } from "react-icons/io5";

interface Props {
  onClick: () => void;
}

export default function FrameNewTabButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={`@tw{
        app-no-drag-area
        flex flex-row
        justify-center items-center
        px-2 text-xl
        bg-zinc-300/30 text-zinc-100 rounded-md
        hover:bg-green-400/80 hover:text-white
        active:opacity-50
        transition-[colors_opacity]
        cursor-default
      }`}
    >
      <IoAdd />
    </button>
  )
}
