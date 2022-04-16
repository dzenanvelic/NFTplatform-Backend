const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
//middleware
dotenv.config()
app.use(express.json())

//database connect
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,


})
    .then(console.log("Connected to mongoDB "))
    .catch((err) => console.log(err))

//routes
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
//server
app.listen(process.env.PORT || '5000', () => console.log(`Server runing on port 5000`))      