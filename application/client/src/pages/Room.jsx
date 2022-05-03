import React, { useState, useRef, useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import axios from 'axios'
import { io } from "socket.io-client"
import { binaryStringToArrayBuffer } from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';

import {
    useNavigate,
    useParams
} from "react-router-dom";
import { Message } from '../components';
import { useWindowSize } from '../components/resize';

const PhantomMessage = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
}

function Room() {
    const navigate = useNavigate()
    const height = useWindowSize()

    const newMessageContainer = useRef()
    const [toast, setToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const sendable = useRef(true)
    const [messages, setMessages] = useState([]);
    const [preKeyBundle, setPreKeyBundle] = useState({});

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
            query: {
                roomid: id,
                uid: userSession.userId,
            },
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

        if (id !== 'new') {
            getMessage()
            // TODO pull prekey bundle
            if (localStorage.getItem(`key_${id}`)) {
                let { identityPubKey, signedPreKey, oneTimePreKeys } = JSON.parse(localStorage.getItem(`key_${id}`))
                identityPubKey = binaryStringToArrayBuffer(identityPubKey)
                signedPreKey.publicKey = binaryStringToArrayBuffer(signedPreKey.publicKey)
                signedPreKey.signature = binaryStringToArrayBuffer(signedPreKey.signature)
                oneTimePreKeys.forEach(key => {
                    key.publicKey = binaryStringToArrayBuffer(key.publicKey)
                })
                setPreKeyBundle({ identityPubKey, signedPreKey, oneTimePreKeys })
            } else {
                axios.get(`http://localhost:4000/room/${id}`)
                    .then(res => {
                        let { user } = res.data
                        user.forEach(value => {
                            if (userSession.userId !== value._id) {
                                let { identityPubKey, signedPreKey, oneTimePreKeys } = value.prekeys
                                localStorage.setItem(`key_${id}`, JSON.stringify({ identityPubKey, signedPreKey, oneTimePreKeys }))
                                identityPubKey = binaryStringToArrayBuffer(identityPubKey)
                                signedPreKey.publicKey = binaryStringToArrayBuffer(signedPreKey.publicKey)
                                signedPreKey.signature = binaryStringToArrayBuffer(signedPreKey.signature)
                                oneTimePreKeys.forEach(key => {
                                    key.publicKey = binaryStringToArrayBuffer(key.publicKey)
                                })
                                setPreKeyBundle({ identityPubKey, signedPreKey, oneTimePreKeys })
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        }

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

        // user joined
        // socket.current.on('joined', () => {
        //     console.log('other user joined')
        //     sendable.current = true
        //     console.log(sendable.current);
        // })

        // user left
        // socket.current.on('left', () => {
        //     console.log('other user left')
        //     sendable.current = false
        //     console.log(sendable.current);
        // })

        // unmount component --> disconnect socket
        return () => {
            socket.current.close()
            socket.current.disconnect()
        }
    }, [])

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
            // const res = await axios.post('http://localhost:4000/room/createroom', room);
            axios.post('http://localhost:4000/room/createroom', room)
                .then(res => {
                    if (res.status === 200) {
                        id = res.data.roomid
                        addMessage()
                        navigate(`/rooms/${res.data.roomid}`)
                    }
                }).catch(error => {
                    if (error.response) {
                        console.error(error.response);
                        if (error.response.status === 302) {
                            id = error.response.data.roomid
                            addMessage()
                            navigate(`/rooms/${error.response.data.roomid}`)
                        }
                        if (error.response.status === 400) {
                            setToastMessage('Can\'t talk to yourself, go make some friends')
                            setToast(true)
                            return
                        } else if (error.response.status === 404) {
                            setToastMessage('User not found')
                            setToast(true)
                            return
                        } else {
                            setToastMessage('Internal error: please try again')
                            setToast(true)
                            return
                        }
                    }
                })
        } else {
            addMessage()
        }
    }

    const addMessage = () => {
        let newMessage = {
            username: userSession.username,
            message: messageRef.current.value,
        }

        // add new message to thread
        setMessages(messages => [...messages, newMessage])

        storeMessage([...messages, newMessage])

        // TODO - fix scroll postion...
        // new message scroll into the bottow of thread
        //newMessageContainer.current.scrollIntoView(true, { behavior: 'smooth' })

        // emit new message to socket
        socket.current.emit('message', { sender: userSession.username, message: messageRef.current.value })
        messageRef.current.value = ''
    }

    const storeMessage = (msgArr) => {
        localStorage.setItem(id, JSON.stringify(msgArr))
    }

    const getMessage = () => {
        const storedMessages = JSON.parse(localStorage.getItem(id))
        if (storedMessages) {
            setMessages(storedMessages)
        }
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


            <div className='message-container overflow-scroll' style={{ height: (height - 158) }}>
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
                <PhantomMessage />
            </div>

            <div className='message-form-container'>
                <form onSubmit={sendMessage}>
                    <div className="container input-group">
                        <input ref={messageRef} type="text" className="form-control" placeholder="Enter your message..." />
                        <button className="btn btn-outline-secondary send-button" type="submit" disabled={!sendable.current}>Send</button>
                    </div>
                </form>
            </div>

            <ToastContainer className="p-3 mt-5" position='top-end'>
                <Toast show={toast} onClose={() => setToast(false)} autohide >
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default Room