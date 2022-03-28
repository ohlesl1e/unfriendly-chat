import React, { useState, useRef, useEffect }  from 'react'
import axios from 'axios'
import { io } from "socket.io-client"

import {
  useParams
} from "react-router-dom";
import { Message } from '../components';

function Room() {
  const newMessageContainer = useRef()

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUsername, setOtherUsername] = useState('');

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const initialValue = JSON.parse(savedUser);
    return initialValue || {};
  })

  const [userSession, setUserSession] = useState(() => {
    const userId = sessionStorage.getItem("unfriendly_id")
    const sessionId = sessionStorage.getItem("unfriendly_session")
    const username = sessionStorage.getItem("unfriendly_user")
    const session = { userId, username, sessionId }
    return session
  })

  // room id from url
  let { id } = useParams()

  const socket = io("http://localhost:8080", {
    query: { roomid: id },
  });

  // some socket io connect stuff
  useEffect(() => {
    // connect
    socket.on('connect', () => console.log(socket.id))

    // new message event + add new message to current messages thread
    socket.on('receive', ({ sender, message}) => {
      // dont listen to receive event if sender is also you
      if (sender == userSession.username) return

      // TODO - refactor adding new message - for this and socket.on(receive)
      let newMessage = {
        username: sender || 'other person....',
        message: message,
      }

      // add new message to thread
      setMessages(messages => [...messages, newMessage])

      // TODO - fix scroll postion...
      // new message scroll into the bottow of thread
      // newMessageContainer.current.scrollIntoView(true, { behavior: 'smooth' })
    })

    // unmount component --> disconnect socket
    return () => { socket.disconnect() }
  }, [id])

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
      try {
          const res = await axios.post('http://localhost:4000/room/createroom', room);
        } catch (err) {
          console.error(err);
      }

      // TODO - clean up..
      // update room id
      id = 'created!'
    }

    // TODO - refactor adding new message - for this and socket.on(receive)
    let newMessage = {
      username: userSession.username,
      message: message,
    }

    // add new message to thread
    setMessages(messages => [...messages, newMessage])

    // update message input field
    setMessage('')

    // TODO - fix scroll postion...
    // new message scroll into the bottow of thread
    newMessageContainer.current.scrollIntoView(true, { behavior: 'smooth' })

    // emit new message to socket
    socket.emit('message', { sender: userSession.username, message: message })
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
                isCurrentUser={username == userSession.username}
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
                isCurrentUser={username == userSession.username}
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