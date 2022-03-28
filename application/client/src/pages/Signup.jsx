import React, { useState, useRef } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useNavigate } from 'react-router'

import axios from 'axios'

export default function Signup() {
  let navigate = useNavigate()

  const [toast, setToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const usernameRef = useRef('')
  const emailRef = useRef('')
  const passwordRef = useRef('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signup = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    const user = { username, email, password }

    // call server to register new user
    axios.post('http://localhost:4000/auth/register',
      {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }, { withCredentials: true })
      .then((res) => {
        // console.log(res.data)

        setUsername('')
        setEmail('')
        setPassword('')

        // set user to session storage
        sessionStorage.setItem('unfriendly_session', res.data.session)
        sessionStorage.setItem('unfriendly_id', res.data.uid)
        sessionStorage.setItem('unfriendly_user', res.data.username)

        // redirect to /
        navigate('/')
        window.location.reload(false)
      }).catch((error) => {
        // console.log(error)
        if (error.response.status === 403) {
          setToastMessage('Email or username is already taken')
          setToast(true)
        } else {
          setToastMessage('Internal error: please try again')
          setToast(true)
        }
      })
  }

  return (
    <div className='container' style={{ maxWidth: "750px" }}>
      <h1>Sign Up</h1>
      <form className="row g-3" onSubmit={signup}>
        <div className="col-12">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={usernameRef} type="text" className="form-control" id="username" placeholder="Enter your username" />
        </div>
        <div className="col-12">
          <label htmlFor="email" className="form-label">Email</label>
          <input ref={emailRef} type="email" className="form-control" id="email" placeholder="Enter your email" />
        </div>
        <div className="col-12">
          <label htmlFor="password" className="form-label">Password</label>
          <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Enter password" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </div>
      </form>

      <ToastContainer className="p-3 mt-5" position='top-end'>
        <Toast show={toast} onClose={() => setToast(false)} autohide >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}
