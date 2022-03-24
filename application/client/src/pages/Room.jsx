import React from 'react'
import {
  useParams
} from "react-router-dom";
import Message from '../components/Message';

function Room() {
  // TODO - dummy data
  let userUid = "1"
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
  ]

  let { id } = useParams()
  // console.log('in Room....');
  // console.log(id);

  return (
    <div className='container'>
      <h1>Room {id}</h1>
      {/* // other user's name --> GET /rooms/:roomId
      // OR new user's email to chat with --> GET /rooms/new ==> later POST to server to create new room */}

      {/* // chat thread */}
      <Message />

      {/* // message form + send btn */}
      
    </div>  

  )
}

export default Room