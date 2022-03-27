import './App.css'
import React, { useState, useEffect }  from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import Room from './pages/Room'
import Signup from './pages/Signup'

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const initialValue = JSON.parse(savedUser);
        return initialValue || {};
    })

    return (
        // TODO - add log out button in navbar
        <div className="App">
            <nav className="navbar navbar-dark bg-dark mb-3">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src={require('./twerk.svg')} alt="" width="30" height="24" className="d-inline-block align-text-top" />
                        Unfriendly Chat
                    </a>
                </div>
            </nav>

            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route exact path="/rooms/:id" element={<Room />} />
            </Routes>
        </div>
    )
}

export default App
