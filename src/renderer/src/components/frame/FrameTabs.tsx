import FrameNewTabButton from './FrameNewTabButton';
import FrameTab from './FrameTab';
import { useAppContext } from '@renderer/AppContext';

export default function FrameTabs() {
    const { tabs, createTab, closeTab } = useAppContext();

    const handleAddTab = () => {
        createTab();
    };

    const handleCloseTab = (uid: string) => {
        closeTab(uid);
    };

    return (
        <div
            className={`@tw{
                flex flex-row gap-2 px-2
            }`}
        >
            {tabs.map(i => (
                <FrameTab
                    key={i.uid}
                    onClose={() => handleCloseTab(i.uid)}
                />
            ))}

            <FrameNewTabButton
                onClick={handleAddTab}
            />
        </div>
    )
}
