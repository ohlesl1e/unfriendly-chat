const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf');
const cors = require('cors');
const io = require('socket.io')(8080, {
    cors: {
        origin: [
            'http://*:3000',
            'localhost:3000',
            /[\w]+:3000/,
        ]
    }
});

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
    const { userId, sessionId } = req.body.sender
    try {
        const receiver = await User.findOne({
            $or: [{ username: req.body.receiver }, { email: req.body.receiver }]
        })
        // check if the receiver exist
        if (!receiver) {
            return res.status(404).send({ error: 'user not found' })
        } else {
            if (userId === receiver._id.toString()) {
                return res.status(400).send({ message: 'can\'t start room with yourself' })
            }
            let room = await Room.where({ user: { $all: [userId, receiver._id.toString()] } })
            console.log(room);
            // check if the room exist
            if (room.length > 0) {
                return res.status(302).send({
                    message: 'room existed',
                    roomid: room[0]._id,
                })
            }

            // make a new room
            room = new Room({
                user: [userId, receiver._id],
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
router.get('/:roomid', async (req, res) => {
    try {
        console.log(req.params.roomid);
        const room = await Room.findById(req.params.roomid)

        // check if room exists and get the other user's prekeys bundle
        if (room) {
            await room.populate({ path: 'user', select: ['username', 'prekeys'] })
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
    const id = socket.handshake.query.roomid
    socket.join(id)
    console.log(`Client ${socket.handshake.query.uid} has connected to ${socket.handshake.query.roomid}`);
    console.log(socket.rooms);

    io.to(id).emit('joined')

    socket.on('message', ({ sender, message }) => {
        console.log({
            sender,
            message
        });
        socket.broadcast.emit('receive', {
            sender,
            message
        })
    })

    socket.on('disconnect', () => {
        console.log(`client ${socket.id} disconnected from ${id}`)
        io.to(id).emit('left')
        socket.leave(id)
    })
})

module.exports = router