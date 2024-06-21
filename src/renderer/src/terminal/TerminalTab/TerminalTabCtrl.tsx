import { TerminalTabUid } from '@common/types/TerminalTab'
import TerminalTabView from './TerminalTabView'

interface Props {
  uid: TerminalTabUid;
}

export default function TerminalTabCtrl(props: Props) {
  return (
    <TerminalTabView
      uid={props.uid}
    />
  )
}
