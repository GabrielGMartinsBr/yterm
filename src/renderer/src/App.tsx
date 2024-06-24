import AppCtrl from './AppCtrl'
import Frame from './components/frame/Frame'
import TerminalTabs from './terminal/TerminalTabs'

function App(): JSX.Element {
  return (
    <AppCtrl>
      <Frame>
        {/* <TerminalMain /> */}
        <TerminalTabs />
      </Frame>
    </AppCtrl>
  )
}

export default App
