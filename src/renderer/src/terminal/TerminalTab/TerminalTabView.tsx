import { TerminalTabUid } from '@common/types/TerminalTab';
import { useAppContext } from '@renderer/AppContext';

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
                ${isVisible ? 'opacity-100 delay-100' : 'opacity-0'}
                transition-opacity duration-200
            }`}
        >
            TerminalTabView: {props.uid}
        </div>
    )
}
