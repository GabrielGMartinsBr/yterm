import { FaTimes } from 'react-icons/fa';
import { TerminalTab } from '@common/types/TerminalTab';
import { useAppContext } from '@renderer/AppContext';

interface Props {
  tab: TerminalTab;
  onClose: () => void;
  onClick: () => void;
}

export default function FrameTab(props: Props) {
  const { selectedTab } = useAppContext();
  const isSelected = props.tab.uid === selectedTab;

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onClose();
  };

  function formattedName() {
    if (!props.tab.cwd) {
      return props.tab.uid;
    }
    const name = props.tab.cwd;
    return name;
  }

  return (
    <div
      onClick={props.onClick}
      className={`@tw{
        app-no-drag-area
        flex flex-row gap-3
        justify-center items-center
        px-1
        rounded-md bg-zinc-300/30

        ${isSelected ? 'bg-zinc-300/60 opacity-100' : 'bg-zinc-300/10 opacity-60'}
        transition-[colors_opacity] duration-200
      }`}
    >

      <h3
        className={`@tw{
          max-w-xs overflow-hidden
          pl-3 whitespace-nowrap text-ellipsis text-left direction-rtl
          ${isSelected ? 'text-white font-semibold' : ''}
        }`}
      >
        {formattedName()}
      </h3>

      <button
        onClick={handleCloseClick}
        className={`@tw{
          w-5 h-5 rounded-full
          flex flex-row
          justify-center items-center
          text-xs bg-zinc-900/30
          hover:bg-orange-400/80
          active:opacity-50
          transition-[colors_opacity]
          cursor-default
        }`}
      >
        <FaTimes />
      </button>

    </div>
  )
}
