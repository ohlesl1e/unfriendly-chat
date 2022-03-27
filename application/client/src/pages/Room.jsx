import React from 'react'
import {
  useParams
} from "react-router-dom";
import { Message } from '../components';

function Room() {
  // TODO - dummy data
  let currentUserUid = "1"
  let room = {
    id: "123",
  }

  let messages = [
    {
      userUid: "1",
      name: 'John',
      message: 'hi',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'hi there',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'hiiii',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'haaaa',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'hallo',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'what',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'huh',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'haaaa',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'hallo',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'what',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'huh',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'haaaa',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'hallo',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'what',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'huh',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'haaaa',
    },
    {
      userUid: "2",
      name: 'Joe',
      message: 'hallo',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'what',
    },
    {
      userUid: "1",
      name: 'John',
      message: 'huh',
    },
  ]

  let { id } = useParams()

  // sendMessage = (message) => {
  //   console.log('sent!');
  //   let newMessage = {
  //     userUid: currentUserUid,
  //     name: 'John',
  //     message: message,
  //   }
  //   messages.push(newMessage)
  // }

  if (id == 'new') {
    return (
      <div className='container' style={{maxWidth: "750px"}}>
        <h1>New Room</h1>
        <form class="form-floating">
          <input type="email" class="form-control" id="recipientEmail" placeholder="name@example.com" />
          <label for="recipientEmail">Recipient's email</label>
        </form>
        <div className='mb-6'>
          {/* {messages.map(({userUid, name, message}, index) => {
            return (
              <Message
                key={index}
                userUid={userUid}
                name={name}
                message={message}
                isCurrentUser={userUid == currentUserUid}
              />
            )
          })} */}
        </div>

        <div class="container input-group fixed-bottom m-auto mb-5" style={{maxWidth: "750px"}}>
          <input type="text" class="form-control" placeholder="Enter your message..." />
          <button class="btn btn-outline-secondary send-button" type="button">Send</button>
        </div>
      </div>  
    )
  } else {
    return (
      <div className='container' style={{maxWidth: "750px"}}>
        <h1>Room {id}</h1>
        {/* // other user's name --> GET /rooms/:roomId
        // OR new user's email to chat with --> GET /rooms/new ==> later POST to server to create new room */}
        <div className='mb-6'>
          {messages.map(({userUid, name, message}, index) => {
            return (
              <Message
                key={index}
                userUid={userUid}
                name={name}
                message={message}
                isCurrentUser={userUid == currentUserUid}
              />
            )
          })}
        </div>
  
        <div class="container input-group fixed-bottom m-auto mb-5" style={{maxWidth: "750px"}}>
          <input type="text" class="form-control" placeholder="Enter your message..." />
          <button class="btn btn-outline-secondary send-button" type="button">Send</button>
        </div>
  
      </div>  
    )
  }
}

export default Room