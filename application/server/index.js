const express = require('express');
const app = express();
const session = require('express-session')
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost*'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
}))
app.use(session({
    key: 'user',
    secret: process.env.SESSION_SECRET || 'nevergonnagiveyouup',
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: true
    }
}))

const authRouter = require('./routes/auth')
const roomRouter = require('./routes/message')

app.use(express.json());

var port = process.env.PORT || 4000

app.use('/auth', authRouter)
app.use('/room', roomRouter)

app.listen(port, () => {
    console.log(`Gateway started on port ${port}`);
});