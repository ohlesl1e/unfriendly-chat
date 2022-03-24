const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

let User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
}))

router.post('/register', (req, res) => {
    console.log({
        endpoint: '/auth/register',
        credential: req.body
    });
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
        return res.status(200).send({ message: 'success' })
    })
})

router.post('/login', (req, res) => {
    console.log({
        endpoint: '/auth/login',
        credential: req.body
    });
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err || !user || bcrypt.hashSync(req.body.password, user.salt) !== user.password) {
            return res.status(403).send({
                error: 'Incorrect email or password'
            })
        }
        return res.status(200).send({ message: 'success' })
    })

})

module.exports = router