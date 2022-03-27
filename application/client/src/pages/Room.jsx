import React, { useState, useRef, useEffect }  from 'react'
import axios from 'axios'

import {
  useParams
} from "react-router-dom";
import { Message } from '../components';

function Room() {
  const newMessageContainer = useRef()

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const initialValue = JSON.parse(savedUser);
    return initialValue || {};
  })

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

  const [userSession, setUserSession] = useState(() => {
    const userId = sessionStorage.getItem("unfriendly_id")
    const sessionId = sessionStorage.getItem("unfriendly_session")
    const session = { userId, sessionId }
    return session
  })

  const [messages, setMessages] = useState([]);
  const [otherUsername, setOtherUsername] = useState('');

  // room id from url
  let { id } = useParams()

  // handle update message
  function handleOnChange(event) {
    setMessage(event.target.value)
  }
  
  const handleOtherUsernameChange = (event) => {
    setOtherUsername(event.target.value)
  }

  const sendMessage = async(event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    // ignore when input field is empty
    if (message == '') return

    // TODO - refactor into new func
    // call server to create new room
    if (id == 'new') {
      let room = {
        sender: userSession,
        receiver: otherUsername
      }
      console.log(room)
      try {
          const res = await axios.post('http://localhost:4000/room/createroom', room);
          console.log('calling create roomm...')
          console.log(res.data);
        } catch (err) {
          // Handle Error Here
          console.log('ERROR -- calling create roomm...')
          console.error(err);
      }

      // update room id
      id = 'created!'
    }
 
    let newMessage = {
      username: user.username,
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

    // socket io stuff

  }

  if (id == 'new') {
    return (
      <div className='container' style={{maxWidth: "750px"}}>
        <h1>New Room</h1>
        <form className="form-floating mb-3">
          <input type="text" className="form-control" id="recipientUsername" value={otherUsername} onChange={handleOtherUsernameChange} />
          <label for="recipientUsername">Recipient's Username</label>
        </form>

        <div className='messages-container'>
          {messages.map(({username, message}, index) => {
            return (
              <Message
                key={index}
                username={username}
                message={message}
                isCurrentUser={username == user.username}
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
                isCurrentUser={username == user.username}
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