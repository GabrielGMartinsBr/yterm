import { FaRegWindowMaximize, FaWindowMinimize, FaTimes } from "react-icons/fa";
import { MainServiceController } from '@renderer/IpcControllers/MainServiceController';
import FrameButton from './FrameButton';

export default function FrameButtons() {
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
        <div className={`@tw{
            ml-auto flex flex-row gap-1
        }`}>
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
