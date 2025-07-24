import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

import NewCanvass from './pages/CreateCanvass'
import EditCanvass from './pages/EditCanvass'
import Dashboard from './pages/Dashboard'
import ListMeasure from './pages/ListMeasure'
import ListItem from './pages/ListItem'
import ListUser from './pages/ListUser'
import ListVendor from './pages/ListVendor'

function App() {
  const [title, setTitle] = useState("")

  return (
    <Router>
      <div className="grid-container">
        <Header />
        <Sidebar />

        <div className="content">
          <h1>{title}</h1>
          <div className="inner-content">
            <Routes>
              <Route path="/" element={<Dashboard setTitle={setTitle} />} />
              <Route path="/canvass/new" element={<NewCanvass setTitle={setTitle} />} />
              <Route path="/canvass/edit" element={<EditCanvass setTitle={setTitle} />} />
              <Route path="/items" element={<ListItem setTitle={setTitle} />} />
              <Route path="/users" element={<ListUser setTitle={setTitle} />} />
              <Route path="/vendors" element={<ListVendor setTitle={setTitle} />} />
              <Route path="/uom" element={<ListMeasure setTitle={setTitle} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App