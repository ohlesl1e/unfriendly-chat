import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { io } from "socket.io-client"

import {
  useNavigate,
  useParams
} from "react-router-dom";
import { Message } from '../components';

function Room() {
  const navigate = useNavigate()

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

  // const [socket, setSocket] = useState(io(
  //   `http://localhost:8080`,
  //   {
  //     query: { roomid: id },
  //     reconnection: true,
  //   }
  // ))

  const socket = useRef(io(
    `http://localhost:8080`,
    {
      query: { roomid: id },
      autoConnect: true,
      reconnection: true,
    }
  ))
  const messageRef = useRef('')
  const receipientRef = useRef('')


  // const socket = io("http://localhost:8080", {
  //   query: { roomid: id },
  // });

  // some socket io connect stuff
  useEffect(() => {
    // connect
    //socket.on('connect', () => console.log(socket.id))
    //console.log(socketRef.current);

    // new message event + add new message to current messages thread
    socket.current.on('receive', ({ sender, message }) => {
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
    return () => { socket.current.disconnect() }
  }, [])

  // handle update message
  function handleOnChange(event) {
    setMessage(event.target.value)
  }

  const handleOtherUsernameChange = (event) => {
    setOtherUsername(event.target.value)
  }

  const sendMessage = async (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    // ignore when input field is empty
    if (messageRef.current.value === '') return

    // TODO - refactor into new func
    // call server to create new room
    if (id == 'new') {
      let room = {
        sender: userSession,
        receiver: receipientRef.current.value
      }
      try {
        // const res = await axios.post('http://localhost:4000/room/createroom', room);
        axios.post('http://localhost:4000/room/createroom', room)
          .then(res => {
            if (res.status === 200) {
              id = res.data.roomid
              navigate(`/rooms/${res.data.roomid}`)
            }
          })
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
      message: messageRef.current.value,
    }

    // add new message to thread
    setMessages(messages => [...messages, newMessage])

    // update message input field
    setMessage('')

    // TODO - fix scroll postion...
    // new message scroll into the bottow of thread
    newMessageContainer.current.scrollIntoView(true, { behavior: 'smooth' })

    // emit new message to socket
    socket.current.emit('message', { sender: userSession.username, message: messageRef.current.value })
    messageRef.current.value = ''
  }

  return (
    <div className="container">
      {id === 'new' ? <>
        <h1>New Room</h1>
        <form className="form-floating mb-3">
          <input ref={receipientRef} type="text" className="form-control" id="recipientUsername" />
          <label htmlFor="recipientUsername">Recipient's Username</label>
        </form>
      </> : <h1>Room {id}</h1>}
      <div className='message-container'>
        <div className='overflow-scroll'>
          {messages.map(({ username, message }, index) => {
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
      </div>

      <form onSubmit={sendMessage}>
        <div className="container input-group fixed-bottom m-auto mb-5">
          <input ref={messageRef} type="text" className="form-control" placeholder="Enter your message..." />
          <button className="btn btn-outline-secondary send-button" type="submit">Send</button>
        </div>
      </form>
    </div>
  )
}

export default Room