const router = require('express').Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')

//router.use(csurf())

mongoose.connect('mongodb://localhost/unfriendlychat')

let Room = mongoose.model('Roon', new mongoose.Schema({
    user: { type: Array, required: true },
    key: { type: Array, required: true }
}))

module.exports = router