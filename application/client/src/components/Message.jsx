import React from 'react'

const Message = (props) => {
  let {username, message, isCurrentUser} = props
  return (
    <div className='mb-4'>
      {isCurrentUser ? <p className='mb-0'>You</p> : <p className='mb-0'>{username}</p>}
      <div className={"alert " + (isCurrentUser ? 'alert-primary' : 'alert-secondary')}>
        {message}
      </div>
    </div>
  )
}

export default Message