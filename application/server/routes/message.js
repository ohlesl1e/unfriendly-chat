const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')
const io = require('socket.io')(8080);

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

const Room = mongoose.model('Room', new mongoose.Schema({
    user: { type: Array, required: true },
    key: { type: Array, required: true }
}))

const User = mongoose.model('User')

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
    try {
        const receiver = await User.findOne({
            $or: [{ username: req.body.receiver }, { email: req.body.receiver }, { _id: req.body.receiver }]
        })
        //console.log({ receiver });
        if (!receiver) {
            return res.status(404).send({ error: 'user not found' })
        } else {
            let room = await Room.where({ user: { $all: [senderID, receiver._id.toString()] } })
            console.log(room);
            if (room.length > 0) {
                return res.status(302).send({ message: 'room existed' })
            }
            room = new Room({
                user: [senderID, receiver._id.toString()],
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
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'internal error' })
    }
})

//router.post('/:roomid', async (req, res) => {
//
//})

io.on('connection', socket => {
    console.log("A client has connected");
    console.log(socket.id);
    const id = socket.handshake.query.roomid
    socket.join(id)
    console.log(socket.rooms);
    socket.on('message', ({ receiver, message }) => {
        console.log({
            receiver,
            message
        });
        socket.broadcast.emit('receive', {
            receiver,
            message
        })
    })
})

module.exports = router