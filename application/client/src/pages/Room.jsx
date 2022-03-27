import React, { useState }  from 'react'
import {
  useParams
} from "react-router-dom";
import { Message } from '../components';

// TODO - use react component
function Room() {
  const [message, setMessage] = useState('');

  // TODO - dummy data
  let currentUserUid = "1"
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
  const [messages, setMessages] = useState(testMessages);

  // room id from url
  let { id } = useParams()

  // handle update message
  function handleOnChange(event) {
    setMessage(event.target.value)
  }

  // handle messaging
  function sendMessage() {
    let newMessage = {
      userUid: currentUserUid,
      name: 'John',
      message: message,
    }

    const newMessages = messages.slice()
    newMessages.push(newMessage)
    setMessages(newMessages)
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
                userUid={userUid}
                name={name}
                message={message}
                isCurrentUser={userUid == currentUserUid}
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
  
        <div className="container input-group fixed-bottom m-auto mb-5" style={{maxWidth: "750px"}}>
        <input type="text" className="form-control" placeholder="Enter your message..." value={message} onChange={handleOnChange} />
          <button className="btn btn-outline-secondary send-button" type="button" onClick={sendMessage}>Send</button>
        </div>
  
      </div>  
    )
  }
}

export default Room