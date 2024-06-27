import { TerminalTabUid } from '@common/types/TerminalTab';
import { useAppContext } from '@renderer/AppContext';
import TerminalTabFront from './TerminalTabFront';

interface Props {
    uid: TerminalTabUid;
}

export default function TerminalTabView(props: Props) {
    const { selectedTab } = useAppContext();
    const isVisible = selectedTab === props.uid;

    return (
        <div
            className={`@tw{
                text-white
                w-full h-full
                absolute inset-0
                // ${isVisible ? 'opacity-100 delay-100 z-10' : 'opacity-0 z-10'}
                // transition-opacity duration-200
                ${isVisible ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-200
            }`}
        >
            <TerminalTabFront
                uid={props.uid}
            />
        </div>
    )
}
