import React from 'react'

export default function Login() {
  return (
    <div className='container' style={{maxWidth: "750px"}}>
      <h1>Login</h1>
      <form class="row g-3">
        <div class="col-12">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" placeholder="Enter your email" />
        </div>
        <div class="col-12">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter password" />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Log In</button>
        </div>
      </form>
    </div>  )
}
