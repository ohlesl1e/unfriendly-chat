const express = require('express');
const app = express();

const authRouter = require('./routes/auth')

app.use(express.json());

var port = process.env.PORT || 4000

app.use('/auth', authRouter)

app.listen(port, () => {
    console.log(`Gateway started on port ${port}`);
});