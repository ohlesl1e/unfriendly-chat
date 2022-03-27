import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

function Home() {
  // TODO - dummy room data
  let testrooms = [
    {
      roomId: '123',
      name: 'Joe',
    },
    {
      roomId: '121',
      name: 'Mary',
    },
    {
      roomId: '122',
      name: 'John',
    },
    {
      roomId: '124',
      name: 'Ann',
    },
  ]

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

  // get rooms for logged in user
  useEffect(async() => {
    let { username } = user

    // call server to get rooms for this user
    const result = await axios.get('http://localhost:4000/room/allrooms', { params: { uid: username } })

    console.log(result.data)
    setRooms(result.data.rooms);
  }, [])

  return (
    // TODO - if no user in localstorage --> login page
    // TODO - else, show all messages page
    <div className='container' style={{maxWidth: "750px"}}>
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
          <div class="alert alert-info d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>No messages yet!</div>
          </div>
          :
          // all rooms
          <div className="card">
            <ul className="list-group list-group-flush">
              {rooms.map(({roomId, name}) => {
                return (
                  <Link key={roomId} className="list-group-item p-4" to={{pathname: `/rooms/${roomId}`}}>
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <FaUser />
                      </div>
                      <div className="flex-grow-0 ms-3">
                        {name}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </ul>
          </div>
      }
      
    </div>
  )
}

export default Home