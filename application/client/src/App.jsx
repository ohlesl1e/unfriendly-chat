import './App.css'
import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { KeyHelper } from '@privacyresearch/libsignal-protocol-typescript'
import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import Room from './pages/Room'
import Signup from './pages/Signup'
import welcome from './images/welcome.png'
import { signalStore } from './signal/state'
import { binaryStringToArrayBuffer } from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';


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
        sessionStorage.removeItem("unfriendly_id")
        sessionStorage.removeItem("unfriendly_session")
        sessionStorage.removeItem("unfriendly_user")
        setUserSession({})

        navigate('/')
        window.location.reload(false)
    }

    useEffect(() => {
        console.log(userSession)
        if (userSession == null) {
            return
        } else {
            // set userSession
            const userId = sessionStorage.getItem("unfriendly_id")
            const sessionId = sessionStorage.getItem("unfriendly_session")
            const username = sessionStorage.getItem("unfriendly_user")
            setUserSession({ userId, username, sessionId })

            // pull keys from localstorage
            const { registrationID, identityKey, baseKeyId, signedPreKeyId } = JSON.parse(localStorage.getItem('unfriendly_key'))
            signalStore.put('registrationId', registrationID)

            const parsedIdentityKey = parseKeyPair(identityKey)
            signalStore.put('identityKey', parsedIdentityKey)

            const parsedBaseKey = parseKeyPair(baseKeyId)
            signalStore.storePreKey(`${baseKeyId.id}`, parsedBaseKey)

            const parsedSignedPreKey = parseKeyPair(signedPreKeyId)
            signalStore.storeSignedPreKey(signedPreKeyId.id, parsedSignedPreKey)

            console.log(signalStore)
        }
    }, [])

    const parseKeyPair = (keyPair) => {
        let { pubKey, privKey } = keyPair
        return {
            pubKey: binaryStringToArrayBuffer(pubKey),
            privKey: binaryStringToArrayBuffer(privKey),
        }
    }


    return (
        // TODO - add log out button in navbar
        <div className="App">
            <nav className="navbar navbar-dark bg-dark sticky-top">
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
                <Route path='/login' element={<Login store={signalStore} />} />
                <Route path='/signup' element={<Signup />} />
                <Route exact path="/rooms/:id" element={<Room store={signalStore} />} />
            </Routes>
        </div>
    )
}

export default App
