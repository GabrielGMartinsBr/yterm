import { TerminalTabUid } from '@common/types/TerminalTab';
import { useAppContext } from '@renderer/AppContext';
import FrameNewTabButton from './FrameNewTabButton';
import FrameTab from './FrameTab';

export default function FrameTabs() {
    const { tabs, createTab, closeTab, selectTab } = useAppContext();

    const handleAddTab = () => {
        createTab();
    };

    const handleCloseTab = (uid: TerminalTabUid) => {
        closeTab(uid);
    };

    const handleSelectTab = (uid: TerminalTabUid) => {
        selectTab(uid);
    };

    return (
        <div
            className={`@tw{
                flex-1
                flex flex-row gap-2 px-2
                overflow-hidden
                }`}
        >
            <div
                className={`@tw{
                    relative flex-1
                }`}
            >
                <div className={`@tw{
                    absolute inset-0 flex flex-row gap-2 
                    overflow-x-auto overflow-y-hidden scrollbar-none
                }`}>
                    {tabs.map(i => (
                        <FrameTab
                            key={i.uid}
                            tab={i}
                            onClick={() => handleSelectTab(i.uid)}
                            onClose={() => handleCloseTab(i.uid)}
                        />
                    ))}
                </div>
            </div>

            <FrameNewTabButton
                onClick={handleAddTab}
            />
        </div>
    )
}
