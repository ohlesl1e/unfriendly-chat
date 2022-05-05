import React, { useState, useRef } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { KeyHelper } from '@privacyresearch/libsignal-protocol-typescript';
import { arrayBufferToString } from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';
import { signalStore } from '../signal/state'

export default function Login() {
  let navigate = useNavigate()

  const [toast, setToast] = useState(false)

  const userRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = (event) => {
    // prevent page refresh on submit form
    event.preventDefault()

    // call server to log in
    axios.post('http://localhost:4000/auth/login',
      {
        user: userRef.current.value,
        password: passwordRef.current.value,
      }, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data)

          // set user to session storage
          sessionStorage.setItem('unfriendly_session', res.data.session)
          sessionStorage.setItem('unfriendly_id', res.data.uid)
          sessionStorage.setItem('unfriendly_user', res.data.username)

          // redirect to /
          createKeys(res.data.uid, res.data.session)
        }
      }).catch((error) => {
        // console.log(error.response)
        if (error.response) {
          if (error.response.status === 403) {
            setToast(true)
          }
        }
      })
  }

  const createKeys = async (uid, session) => {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    const baseKeyId = Math.floor(10000 * Math.random())
    const preKey = await KeyHelper.generatePreKey(baseKeyId)
    const signedPreKeyId = Math.floor(10000 * Math.random())
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)

    const publicSignedPreKey = {
      keyId: signedPreKeyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    }

    const publicPreKey = {
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey
    }

    const preKeyBundle = {
      uid,
      identityPubKey: arrayBufferToString(identityKeyPair.pubKey),
      signedPreKey: {
        keyId: publicSignedPreKey.keyId,
        publicKey: arrayBufferToString(publicSignedPreKey.publicKey),
        signature: arrayBufferToString(publicSignedPreKey.signature),
      },
      oneTimePreKeys: [
        {
          keyId: preKey.keyId,
          publicKey: arrayBufferToString(preKey.keyPair.pubKey),
        }
      ]
    }

    // create identity for current user
    signalStore.put('registrationId', uid)
    signalStore.put('identityKey', identityKeyPair)
    signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair)
    signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)

    localStorage.setItem(`unfriendly_key`, JSON.stringify({
      registrationID: uid,
      identityKey: {
        pubKey: arrayBufferToString(identityKeyPair.pubKey),
        privKey: arrayBufferToString(identityKeyPair.privKey),
      },
      baseKeyId: {
        pubKey: arrayBufferToString(preKey.keyPair.pubKey),
        privKey: arrayBufferToString(preKey.keyPair.privKey),
      },
      signedPreKeyId: {
        pubKey: arrayBufferToString(signedPreKey.keyPair.pubKey),
        privKey: arrayBufferToString(signedPreKey.keyPair.privKey),
      },
    }))

    console.log(preKeyBundle);

    axios.post('http://localhost:4000/auth/storekey', {
      uid,
      session,
      preKeyBundle,
    }).then(res => {
      navigate('/')
      //window.location.reload(false)
    }).catch((error) => {
      // console.log(error)
      if (error.response) {
        if (error.response.status === 403) {
          setToastMessage('Email or username is already taken')
          setToast(true)
        } else {
          setToastMessage('Internal error: please try again')
          setToast(true)
        }
      }
    })
  }

  return (
    <div className='container' style={{ maxWidth: "750px" }}>
      <h1>Login</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={userRef} type="text" className="form-control" id="username" placeholder="Enter your username" />
        </div>
        <div className="col-12">
          <label htmlFor="password" className="form-label">Password</label>
          <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Enter password" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Log In</button>
        </div>
      </form>

      <ToastContainer className="p-3 mt-5" position='top-end'>
        <Toast show={toast} onClose={() => setToast(false)} autohide >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>Incorrect email or password</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>)
}
