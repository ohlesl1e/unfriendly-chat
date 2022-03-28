const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')
const io = require('socket.io')(8080);

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

const User = mongoose.model('User')

const Room = mongoose.model('Room', new mongoose.Schema({
    user: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        required: true,
    },
    key: { type: Array, required: true }
}))

router.get('/allrooms', async (req, res) => {

    console.log({
        session: req.session,
        uid: req.query.uid
    })
    const uid = req.query.uid

    if (!uid) {
        return res.status(404).send({ error: 'please include the uid' })
    }
    try {
        const result = await Room.where({ user: uid }).select('user')

        // console.log(result);
        // populate the user field
        for (const room of result) {
            await room.populate({ path: 'user', select: 'username' })
        }

        return res.status(200).send({ rooms: result })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'internal error' })
    }
})

router.post('/createroom', async (req, res) => {
    const senderID = req.body.uid
    try {
        const receiver = await User.findOne({
            $or: [{ username: req.body.receiver }, { email: req.body.receiver }]
        })
        // check if the receiver exist
        if (!receiver) {
            return res.status(404).send({ error: 'user not found' })
        } else {
            let room = await Room.where({ user: { $all: [senderID, receiver._id.toString()] } })
            console.log(room);
            // check if the room exist
            if (room.length > 0) {
                return res.status(302).send({ message: 'room existed' })
            }

            // make a new room
            room = new Room({
                user: [senderID, receiver._id],
                key: [],
            })
            await room.populate({ path: 'user', select: 'username' })
            // console.log({ users: room.user });
            room.save(err => {
                if (err) {
                    return res.status(500).send({ error: 'please try again' })
                }

                return res.status(200).send({
                    message: 'room created',
                    roomid: room._id,
                    user: room.user,
                    key: room.key
                })
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'internal error' })
    }
})


// call this when you join a room
router.post('/:roomid', async (req, res) => {
    try {
        console.log(req.params.roomid);
        const room = await Room.findById(req.params.roomid)

        // check if room exists
        if (room) {
            await room.populate({ path: 'user', select: 'username' })
            console.log({ room })
            return res.status(200).send({
                message: 'room found',
                roomid: room._id,
                user: room.user,
                key: room.key
            })
        }
        return res.status(404).send({ message: 'room not found' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'internal error' })
    }
})

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