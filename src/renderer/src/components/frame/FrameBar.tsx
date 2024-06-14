import { FaRegWindowMaximize, FaWindowMinimize, FaTimes } from "react-icons/fa";

import { MainServiceController } from '@renderer/IpcControllers/MainServiceController';
import FrameButton from './FrameButton';

export default function FrameBar() {

    const handleMinimizeClick = () => {
        MainServiceController.minimize();
    };

    const handleToggleMaximizeClick = () => {
        MainServiceController.toggleMaximize();
    };

    const handleCloseClick = () => {
        MainServiceController.close();
    };

    return (
        <div
            className={`@tw{
                app-drag-area select-none cursor-default
                flex flex-row gap-1
                px-2 py-1
                bg-zinc-900/30 text-zinc-100
            }`}
        >
            <h2
                className={`@tw{
                    text-lg font-medium
                    mr-auto
                }`}
            >
                YTerm
            </h2>

            <FrameButton onClick={handleMinimizeClick}>
                <FaWindowMinimize />
            </FrameButton>

            <FrameButton onClick={handleToggleMaximizeClick}>
                <FaRegWindowMaximize />
            </FrameButton>

            <FrameButton onClick={handleCloseClick}>
                <FaTimes />
            </FrameButton>
        </div>
    )
}
