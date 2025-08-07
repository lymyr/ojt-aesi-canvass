import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ListMeasure from './pages/ListMeasure';
import ListItem from './pages/ListItem';
import ListUser from './pages/ListUser';
import ListVendor from './pages/ListVendor';
import Login from './pages/Login';
import CanvassView from './pages/CanvassView';

import axios from "./axios";


function MainLayout({ setTitle, title, onLogout, user }) {
  return (
    <div className="grid-container">
      <Header onLogout={onLogout} />
      <Sidebar user={user} />
      <div className="content">
        <h1>{title}</h1>
        <div className="inner-content">
          <Routes>
            <Route path="/canvass" element={<Dashboard setTitle={setTitle} userRole={user.role}/>} />
            <Route path="/canvass/new" element={<CanvassView setTitle={setTitle} username={user.username} userRole={user.role} />} />
            <Route
              path="/canvass/:id"
              element={<CanvassView mode="edit" setTitle={setTitle} username={user.username} userRole={user.role}/>}
            />
            <Route path="/items" element={<ListItem setTitle={setTitle} />} />
            <Route path="/vendors" element={<ListVendor setTitle={setTitle} />} />
            <Route path="/uom" element={<ListMeasure setTitle={setTitle} />} />
            
            {/* ✅ Only render this route if user is admin */}
            {user.role === "admin" && (
              <Route path="/users" element={<ListUser setTitle={setTitle} />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState( {name: "BypassedUser" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user");
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      // First, get the CSRF cookie
      await axios.get("/sanctum/csrf-cookie");

      // Then send login credentials
      await axios.post("/api/login", {
        username: credentials.username,
        password: credentials.password,
      });

      // If successful, fetch the logged-in user
      const { data } = await axios.get("/api/user");

      setUser(data); // Save user info
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check your username and password.");
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            user ? (
              <MainLayout user={user} setTitle={setTitle} title={title} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}


export default App;