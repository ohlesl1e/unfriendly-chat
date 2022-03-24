import React from 'react'
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

function Home() {
  // TODO - dummy room data
  let rooms = [
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

  return (
    <div className='container' style={{maxWidth: "750px"}}>
      <div className='d-flex justify-content-between mb-5'>
        <h1>All Messages</h1>
        <div>
          <Link type="button" className="btn btn-primary" to='/rooms/new'>
            New Message
          </Link>
        </div>
      </div>

      <div className="card">
        <ul className="list-group list-group-flush">
          {/* TODO - add empty state */}
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
    </div>
  )
}

export default Home