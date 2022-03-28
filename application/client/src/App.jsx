import './App.css'
import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import Room from './pages/Room'
import Signup from './pages/Signup'
import welcome from './images/whalecum.png'

function App() {
    let navigate = useNavigate()

    const [userSession, setUserSession] = useState(() => {
        const userId = sessionStorage.getItem("unfriendly_id")
        const sessionId = sessionStorage.getItem("unfriendly_session")
        const username = sessionStorage.getItem("unfriendly_user")
        const session = { userId, username, sessionId }
        return session
    })

    const logout = () => {
        sessionStorage.setItem("unfriendly_id", "")
        sessionStorage.setItem("unfriendly_session", "")
        sessionStorage.setItem("unfriendly_user", "")
        setUserSession({})

        navigate('/')
        window.location.reload(false)
    }

    return (
        // TODO - add log out button in navbar
        <div className="App">
            <nav className="navbar navbar-dark bg-dark mb-3 sticky-top">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src={require('./twerk.svg')} alt="" width="30" height="24" className="d-inline-block align-text-top" />
                        Unfriendly Chat
                    </a>
                    <div className='navbar-nav'>
                        {userSession && userSession.username ? (
                            <div className="d-flex">
                                <div className="navbar-brand">
                                    <img src={welcome} alt='welcome' width="30" height="24" className="d-inline-block align-text-top me-1" />
                                    {userSession.username}
                                </div>
                                <button className="btn btn-primary" onClick={logout}>Log Out</button>
                            </div>
                        ) : (
                            <div className="d-flex">
                                <a className="btn btn-outline-light me-3" href='/login'>Log In</a>
                                <a className="btn btn-primary" href='/signup'>Sign Up</a>
                            </div>
                        )
                        }
                    </div>
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
