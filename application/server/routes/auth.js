const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf');
const { cleanXSS } = require('../util/input_validation');

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    prekeys: {type: Object, required: false}
}))

router.post('/register', (req, res) => {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.password, salt)
    req.body.username = cleanXSS(req.body.username).trim()
    req.body.email = req.body.email.trim()
    req.body.password = hash
    req.body.salt = salt
    let user = new User(req.body)

    // make a new user and save it to mongodb
    user.save(err => {
        if (err) {
            let error = 'Please try again'

            // if email or uesrname not unique
            if (err.code === 11000) {
                error = 'Email or username is already taken'
            }
            return res.status(403).send({ error: error })
        }
        const userInfo = {
            uid: user._id,
            username: user.username,
            // email: user.email
        }
        // save the user id and username to session
        req.session.user = userInfo

        return res.status(200).send({
            ...userInfo,
            session: req.session.id,
        })
    })
})

router.post('/login', (req, res) => {
    const cred = req.body.user.trim()
    User.findOne({
        $or: [{ email: cred }, { username: cred }]
    }, async (err, user) => {
        if (err || !user || bcrypt.hashSync(req.body.password, user.salt) !== user.password) {
            return res.status(403).send({
                error: 'Incorrect email or password'
            })
        }
        const userInfo = {
            uid: user._id,
            username: user.username,
            // email: user.email
        }

        // save the user id and username to session
        req.session.user = userInfo

        return res.status(200).send({
            ...userInfo,
            session: req.session.id,
        })
    })
})

router.post('/storekey', (req, res) => {
    console.log({
        session: req.body.session,
        uid: req.body.uid,
        bundle: req.body.preKeyBundle
    })
    const uid = req.body.uid
    User.findById(uid, async (err, user) => {
        if (err || !user) {
            return res.status(404).send()
        }

        console.log(user)

        user.prekeys = req.body.preKeyBundle
        await user.save()
        return res.status(200).send()
    })
})

module.exports = router