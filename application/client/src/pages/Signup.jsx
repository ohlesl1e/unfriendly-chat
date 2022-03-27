import React from 'react'

export default function Signup() {
  return (
    <div className='container' style={{maxWidth: "750px"}}>
      <h1>Sign Up</h1>
      <form class="row g-3">
        <div class="col-md-6">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" class="form-control" id="firstName" placeholder="Enter your first name" />
        </div>
        <div class="col-md-6">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" class="form-control" id="lastName" placeholder="Enter your last name" />
        </div>
        <div class="col-12">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" placeholder="Enter your email" />
        </div>
        <div class="col-12">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter password" />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </div>
      </form>
    </div>
  )
}
