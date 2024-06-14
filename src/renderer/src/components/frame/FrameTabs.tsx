import FrameTab from './FrameTab';

export default function FrameTabs() {
    return (
        <div
            className={`@tw{
                flex flex-row gap-2 px-2
            }`}
        >
            <FrameTab />
            <FrameTab />
        </div>
    )
}
