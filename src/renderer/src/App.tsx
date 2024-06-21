import AppCtrl from './AppCtrl'
import Frame from './components/frame/Frame'
import TerminalMain from './terminal/TerminalMain'

function App(): JSX.Element {
  return (
    <AppCtrl>
      <Frame>
        <TerminalMain />
      </Frame>
    </AppCtrl>
  )
}

export default App
