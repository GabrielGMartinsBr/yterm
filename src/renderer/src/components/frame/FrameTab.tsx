import { } from 'react-icons';
import { FaTimes } from 'react-icons/fa';

export default function FrameTab() {
  return (
    <div
      className={`@tw{
        app-no-drag-area
        flex flex-row gap-3
        justify-center items-center
        px-1
        rounded-md bg-zinc-300/30
      }`}
    >

      <h3
        className={`@tw{pl-3}`}
      >
        Frame Tab
      </h3>

      <button
        className={`@tw{
          w-5 h-5 rounded-full
          flex flex-row
          justify-center items-center
          text-xs bg-zinc-900/30
          hover:bg-orange-400/80
          transition-colors
          cursor-default
        }`}
      >
        <FaTimes />
      </button>

    </div>
  )
}
