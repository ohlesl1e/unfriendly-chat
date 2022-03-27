import React, { useRef } from 'react'
import axios from 'axios'

export default function Login() {
  const userRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:4000/auth/login',
      {
        user: userRef.current.value,
        password: passwordRef.current.value,
      }, { withCredentials: true })
      .then(res => {
        sessionStorage.setItem('unfriendly_session', res.data.session)
        sessionStorage.setItem('unfriendly_id', res.data.uid)
        sessionStorage.setItem('unfriendly_user', res.data.username)
      }).catch(error => console.log(error))
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
