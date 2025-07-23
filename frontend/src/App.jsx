import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import NewCanvass from './pages/NewCanvass'
import EditCanvass from './pages/EditCanvass'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="grid-container">
          <Header />
          <Sidebar />

          <div className="content">
            <h1>Create Canvass</h1>
            <div className="inner-content">
              <EditCanvass />
            </div>
          </div>

        </div>
    </>
  )
}

export default App
