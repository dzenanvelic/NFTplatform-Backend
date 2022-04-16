


const router = require('express').Router()
const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validate } = require('../models/User')
const { auth, } = require('../middlewares/loginRequire');

//testroute for jwt 

router.get("/test", auth, (req, res) => {
    res.status(200).json("Hello world")
})
//REGISTER
router.post("/register", async (req, res) => {
    try {
        //check is all data filled up
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(422).json({ error: "Please fill up all fields" })
        }
        // check all users if exist already same
        const savedUser = await User.findOne({ username: username })

        if (savedUser) {
            return res.status(422).json({ error: "User already exists" })
        }



        //Generate hashed password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        res.status(200).json({ message: "User succesfuly created" })


    } catch (error) {
        res.status(500).json(`Unable to create user + ${error}`)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        //check is all fields filled up
        if (!username || !password) {
            return res.status(422).json({ error: "Please fill up username or password field" })
        }
        //find user if exists
        const user = await User.findOne({ username })
        if (!user) { return res.status(400).json({ error: "Wrong credentials!" }) }
        //compare passwords
        const validated = await bcrypt.compare(password, user.password)
        if (!validated) {
            return res.status(400).json({ error: "Wrong credentials!" })
        }
        //assign token for user
        const token = await jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET)

        res.status(200).json({ message: "You are succesfully logged in", token })
    } catch (error) {
        res.status(500).json(`Unable to login 
 ${error}`)
    }


})
module.exports = router