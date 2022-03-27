import React, { useState, useRef, useEffect }  from 'react'
import axios from 'axios'

import {
  useParams
} from "react-router-dom";
import { Message } from '../components';

function Room() {
  const newMessageContainer = useRef()

  const [message, setMessage] = useState('');

  // TODO - dummy data
  let currentUsername = "test"
  let room = {
    id: "123",
  }

  // TODO - clean up...
  let testMessages = [
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

  // TODO - clean up, dont to get messages from db
  const [messages, setMessages] = useState([]);

  // room id from url
  let { id } = useParams()

  // handle update message
  function handleOnChange(event) {
    setMessage(event.target.value)
  }

  const sendMessage = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    // ignore when input field is empty
    if (message == '') return

    let newMessage = {
      userUid: currentUserUid,
      name: 'John', // TODO - fix
      message: message,
    }

    // add new message to thread
    const newMessages = messages.slice()
    newMessages.push(newMessage)

    // update messages thread
    setMessages(newMessages)

    // update message input field
    setMessage('')

    // TODO - fix scroll postion...
    // new message scroll into the bottow of thread
    newMessageContainer.current.scrollIntoView(true, { behavior: 'smooth' })
  }

  if (id == 'new') {
    return (
      <div className='container' style={{maxWidth: "750px"}}>
        <h1>New Room</h1>
        <form className="form-floating">
          <input type="text" className="form-control" id="recipientUsername" />
          <label for="recipientUsername">Recipient's Username</label>
        </form>
        <div className='mb-6'>
          {/* {messages.map(({userUid, name, message}, index) => {
            return (
              <Message
                key={index}
                username={username}
                message={message}
                isCurrentUser={username == currentUsername}
              />
            )
          })} */}
        </div>

        <div className="container input-group fixed-bottom m-auto mb-5" style={{maxWidth: "750px"}}>
          <input type="text" className="form-control" placeholder="Enter your message..." value={message} onChange={handleOnChange} />
          <button className="btn btn-outline-secondary send-button" type="button" onClick={sendMessage}>Send</button>
        </div>
      </div>  
    )
  } else {
    return (
      <div className='container' style={{maxWidth: "750px"}}>
        <h1>Room {id}</h1>
        <div className='messages-container'>
          {messages.map(({username, message}, index) => {
            return (
              <Message
                key={index}
                username={username}
                message={message}
                isCurrentUser={username == currentUsername}
              />
            )
          })}

          <div className='p-5' ref={newMessageContainer}></div>
        </div>

        <div className="container input-group fixed-bottom m-auto mb-5" style={{maxWidth: "750px"}}>
          <input type="text" className="form-control" placeholder="Enter your message..." value={message} onChange={handleOnChange} />
          <button className="btn btn-outline-secondary send-button" type="button" onClick={sendMessage}>Send</button>
        </div>
      </div>  
    )
  }
}

export default Room