import React, { useState, useRef } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router'

export default function Login() {
  let navigate = useNavigate()

  const [toast, setToast] = useState(false)

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
      }, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data)

          // set user to session storage
          sessionStorage.setItem('unfriendly_session', res.data.session)
          sessionStorage.setItem('unfriendly_id', res.data.uid)
          sessionStorage.setItem('unfriendly_user', res.data.username)

          // redirect to /
          navigate('/')
          window.location.reload(false)
        }
      }).catch((error) => {
        // console.log(error.response)
        if (error.response) {
          if (error.response.status === 403) {
            setToast(true)
          }
        }
      })
  }

  return (
    <div className='container' style={{ maxWidth: "750px" }}>
      <h1>Login</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={userRef} type="text" className="form-control" id="username" placeholder="Enter your username" />
        </div>
        <div className="col-12">
          <label htmlFor="password" className="form-label">Password</label>
          <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Enter password" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Log In</button>
        </div>
      </form>

      <ToastContainer className="p-3 mt-5" position='top-end'>
        <Toast show={toast} onClose={() => setToast(false)} autohide >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>Incorrect email or password</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>)
}
