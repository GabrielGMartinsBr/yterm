import FrameTabs from './FrameTabs';
import FrameButtons from './FrameButtons';

export default function FrameBar() {
    return (
        <div
            className={`@tw{
                app-drag-area w-full 
                select-none cursor-default
                flex flex-row gap-3
                px-2 py-2
                bg-zinc-900/30 text-zinc-100
            }`}
        >
            <h2
                className={`@tw{
                    text-lg font-medium
                }`}
            >
                YTerm
            </h2>

            <FrameTabs />

            <FrameButtons />
        </div>
    )
}
