import TerminalMain from './terminal/TerminalMain'

function App(): JSX.Element {
  return (
    <div className={`@tw{
      w-full h-screen
      flex flex-col
      justify-start items-start
      bg-zinc-900 text-zinc-300
    }`}>

      <TerminalMain />

    </div>
  )
}

export default App
