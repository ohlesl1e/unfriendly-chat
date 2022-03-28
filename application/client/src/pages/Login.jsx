import React, { useState, useRef }  from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

export default function Login() {
  let navigate = useNavigate()

  const userRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    // call server to log in
    axios.post('http://localhost:4000/auth/login', 
    {
      user: userRef.current.value,
      password: passwordRef.current.value,
    }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
    
        // set user to session storage
        sessionStorage.setItem('unfriendly_session', res.data.session)
        sessionStorage.setItem('unfriendly_id', res.data.uid)
        sessionStorage.setItem('unfriendly_user', res.data.username)

        // redirect to /
        navigate('/')
        window.location.reload(false)
      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='container' style={{ maxWidth: "750px" }}>
      <h1>Login</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={userRef} type="text" className="form-control" id="username" placeholder="Enter your username or email" />
        </div>
        <div className="col-12">
          <label htmlFor="password" className="form-label">Password</label>
          <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Enter password" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Log In</button>
        </div>
      </form>
    </div>)
}
