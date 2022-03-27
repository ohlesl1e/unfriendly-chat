const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')
const session = require('express-session')

//router.use(session({
//    key: 'user',
//    secret: process.env.SESSION_SECRET || 'nevergonnagiveyouup',
//    saveUninitialized: true,
//    resave: false,
//    cookie: {
//        secure: true
//    }
//}))

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
}))

router.post('/register', (req, res) => {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.password, salt)
    req.body.password = hash
    req.body.salt = salt
    let user = new User(req.body)

    user.save(err => {
        if (err) {
            let error = 'Please try again'
            if (err.code === 11000) {
                error = 'Email or username is already taken'
            }
            return res.status(403).send({ error: error })
        }
        const userInfo = {
            username: user.username,
            email: user.email
        }
        req.session.user = userInfo
        console.log({
            endpoint: '/auth/register',
            credential: req.body,
            session: req.session,
        });
        return res.status(200).json({
            message: 'success',
            userInfo,
            session: req.session.user
        })
    })
})

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err || !user || bcrypt.hashSync(req.body.password, user.salt) !== user.password) {
            return res.status(403).send({
                error: 'Incorrect email or password'
            })
        }
        const userInfo = {
            uid: user._id,
            username: user.username,
            email: user.email
        }

        req.session.user = userInfo
        console.log({
            endpoint: '/auth/login',
            credential: req.body,
            session: req.session
        });
        return res.status(200).json({
            message: 'success',
            userInfo,
        })
    })

})

module.exports = router