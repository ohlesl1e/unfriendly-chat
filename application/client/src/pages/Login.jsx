import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

export default function Login() {
  let navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const login = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    const user = { email, password }

    // call server to log in
    axios.post('http://localhost:4000/auth/login', user)
      .then((res) => {
        console.log(res.data)

        setEmail('')
        setPassword('')
    
        // set user to localstorage
        localStorage.setItem("user", JSON.stringify(user));

        // redirect to /
        navigate('/')
      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='container' style={{maxWidth: "750px"}}>
      <h1>Login</h1>
      <form class="row g-3">
        <div class="col-12">
          <label for="email" class="form-label">Email</label>
          <input type="text" class="form-control" id="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
        </div>
        <div class="col-12">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary" onClick={login}>Log In</button>
        </div>
      </form>
    </div>  )
}
