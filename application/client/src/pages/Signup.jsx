import React, { useState, useEffect }  from 'react'
import { useNavigate } from 'react-router'

import axios from 'axios'

export default function Signup() {
  let navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState()

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const signup = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    const user = { username, email, password }

    // call server to register new user
    axios.post('http://localhost:4000/auth/register', user)
      .then((res) => {
        console.log(res.data)
      }).catch((error) => {
        console.log(error)
      })

    setUsername('')
    setEmail('')
    setPassword('')

    // set user to localstorage
    localStorage.setItem("user", JSON.stringify(user));

    // redirect to /
    navigate('/')
  }

  return (
    <div className='container' style={{maxWidth: "750px"}}>
      <h1>Sign Up</h1>
      <form className="row g-3">
        <div className="col-12">
          <label for="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" placeholder="Enter your username" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="col-12">
          <label for="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="col-12">
          <label for="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary" onClick={signup}>Sign Up</button>
        </div>
      </form>
    </div>
  )
}
