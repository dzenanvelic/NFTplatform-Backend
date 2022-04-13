const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const authRoute = require('./routes/auth')

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

//server
app.listen(process.env.PORT || '5000', () => console.log(`Server runing on port 5000`))      