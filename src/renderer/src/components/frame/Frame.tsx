import { PropsWithChildren } from 'react';
import FrameCtrl from './FrameCtrl';
import FrameView from './FrameView';

export default function Frame(props: PropsWithChildren) {
    return (
        <FrameCtrl>
            <FrameView>
                {props.children}
            </FrameView>
        </FrameCtrl>
    )
}