import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Room from './pages/Room'
import Signup from './pages/Signup'

function App() {
    return (
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
