import { useImmer } from 'use-immer';
import FrameNewTabButton from './FrameNewTabButton';
import FrameTab from './FrameTab';
import { nanoid } from 'nanoid';

export default function FrameTabs() {
    const [tabs, tabsUpdate] = useImmer([
        { uid: nanoid() },
        { uid: nanoid() },
    ]);

    const handleAddTab = () => {
        tabsUpdate(d => {
            d.push({
                uid: nanoid()
            });
        });
    };

    const handleCloseTab = (uid: string) => {
        tabsUpdate(d => {
            const index = d.findIndex(i => i.uid === uid);
            if (index > -1) {
                d.splice(index, 1);
            }
        });
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
