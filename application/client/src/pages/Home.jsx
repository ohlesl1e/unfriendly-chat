import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

function Home() {
  const [rooms, setRooms] = useState([])

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const initialValue = JSON.parse(savedUser);
    return initialValue || {};
  })

  // check logged in user
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [userSession, setUserSession] = useState(() => {
    const userId = sessionStorage.getItem("unfriendly_id")
    const sessionId = sessionStorage.getItem("unfriendly_session")
    const username = sessionStorage.getItem("unfriendly_user")
    const session = { userId, username, sessionId }
    return session
  })

  // get rooms for logged in user
  useEffect(async () => {
    let { userId } = userSession

    // call server to get rooms for this user
    if (userId) {
      const result = await axios.get('http://localhost:4000/room/allrooms', { params: { uid: userId } })
      console.log(result.data)

      setRooms(result.data.rooms)
      localStorage.setItem('rooms', JSON.stringify(result.data.rooms))
    }
  }, [])

  return (
    // TODO - if no user in localstorage --> login page
    // TODO - else, show all messages page
    <div className='container mt-3' style={{ maxWidth: "750px" }}>
      {userSession && userSession.username ? (
        <div>
          <div className='d-flex justify-content-between mb-5'>
            <h1>All Messages</h1>
            <div>
              <Link type="button" className="btn btn-primary" to='/rooms/new'>
                New Message
              </Link>
            </div>
          </div>

          {
            (rooms.length === 0)
              ?
              // empty state
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <div>No messages yet!</div>
              </div>
              :
              // all rooms
              <div className="card">
                <ul className="list-group list-group-flush">
                  {rooms.map(({ _id, user }) => {
                    return (
                      <Link key={_id} className="list-group-item p-4" to={{ pathname: `/rooms/${_id}` }}>
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <FaUser />
                          </div>
                          <div className="flex-grow-0 ms-3">
                            {userSession.username == user[1].username ? user[0].username : user[1].username}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </ul>
              </div>
          }
        </div>
      ) : (
        <div className="px-4 py-5 my-5 text-center">
          <h1 className='display-5 fw-bold'>Welcome to Unfriendly Chat!</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">Securing Network communications using the Signal Protocol.</p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <a className="btn btn-outline-secondary me-3 btn-lg px-4 gap-3" href='/login'>Log In</a>
              <a className="btn btn-primary btn-lg px-4" href='/signup'>Sign Up</a>
            </div>
          </div>
        </div>
      )
      }
    </div>
  )
}

export default Home