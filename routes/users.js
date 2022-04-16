const router = require('express').Router()
const User = require('../models/User')
const { auth } = require('../middlewares/loginRequire')
const bcrypt = require('bcrypt')

//update
router.put('/:id', auth, async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(12)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            res.status(200).json("User succesfuly updated")
        } catch (error) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can update only your account")
    }
})



//delete
router.delete('/:id', auth, async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("User succesfuly deleted")
            } catch (error) {
                res.status(500).json(`Deleting user unsucessfull + ${error}`)
            }
        } catch (error) {
            res.status(404).json("User not found")
        }

    } else {
        res.status(403).json("You are not allowed")
    }
})
//GET USER

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(`User finding error ${error}`)
    }
})


module.exports = router