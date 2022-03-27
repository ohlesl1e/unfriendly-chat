const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')
//const User = require('./auth').User
const io = require('socket.io')(8080);

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

const Room = mongoose.model('Room', new mongoose.Schema({
    user: { type: Array, required: true },
    key: { type: Array, required: true }
}))

const User = mongoose.model('User')

const test = new Room({
    user: [],
    key: []
})

test.save()

router.get('/allrooms', async (req, res) => {

    console.log({
        session: req.sessionID,
        uid: req.query.uid
    })
    const uid = req.query.uid

    if (!uid) {
        return res.status(404).send({ error: 'please include the uid' })
    }
    try {
        const result = await Room.where({ user: uid })

        console.log(result);

        return res.status(200).send({ rooms: result })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'internal error' })
    }
})

router.post('/createroom', async (req, res) => {
    const senderID = req.body.sender
    const receiver = req.body.receiver
    try {
        const receiverID = await User.findOne({
            $or: [{ username: receiver }, { email: receiver }]
        }).projection({ _id: 1 })
        console.log({ receiverID });
        if (!receiverID) {
            return res.status(404).send({ error: 'user not found' })
        }
        let room = await Room.where({ user: { $all: [senderID, receiverID._id] } })
        if (room) {
            return res.status(302).send({ message: 'room existed' })
        }
        room = new Room({
            user: [senderID, receiverID],
            key: [],
        })
        room.save(err => {
            if (err) {
                return res.status(500).send({ error: 'please try again' })
            }
            return res.status(200).send({
                message: 'room created',
                roomid: room._id
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'internal error' })
    }
})

//router.post('/:roomid', async (req, res) => {
//
//})

io.on('connection', socket => {
    const id = socket.handshake.query.roomid
    socket.join(id)

    socket.on('sendmessage', ({ recipients, text }) => {
        recipients.forEach(recipient => {
            socket.broadcast.to(recipient).emit('receivemessage', {
                recipients: recipients,
                text
            })
        });
    })
})

module.exports = router