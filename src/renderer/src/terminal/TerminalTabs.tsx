import { useAppContext } from '@renderer/AppContext'
import TerminalTabCtrl from './TerminalTab/TerminalTabCtrl';

export default function TerminalTabs() {
    const { tabs } = useAppContext();

    return (
        <>
            {tabs.map(i => (
                <TerminalTabCtrl
                    key={i.uid}
                    uid={i.uid}
                />
            ))}
        </>
    )
}
