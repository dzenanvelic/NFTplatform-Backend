const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const { auth } = require('../middlewares/loginRequire')


//CREATE POST

router.post('/', auth, async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(`Creating post failed ${error}`)
    }
})

//Update POST

router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username === req.body.username) {

            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                res.status(200).json(updatedPost)
            } catch (error) {
                res.status(500).json(`Post udating error ${error}`)
            }

        } else {
            res.status(401).json("You can update only your posts")
        }
    } catch (error) {

    }

})

//Delete POST
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (req.body.username === post.username) {
            const postDelete = await post.delete()
            res.status(200).json('You successfuly deleted post')
        } else {
            res.status(401).json("You can delete only your posts")
        }
    } catch (error) {
        res.status(500).json(`Post deleting error ${error}`)
    }
})


//Get POST
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(`Finding this post error ${error}`)
    }
})

//GET ALL POSTS
router.get('/', async (req, res) => {

    try {
        const username = req.query.user;
        const catName = req.query.cat;
        let posts;

        if (username) {
            posts = await Post.find({ username })

        } else if (catName) {
            posts = await Post.find({ categories: { $in: [catName], } })
        } else {
            posts = await Post.find()

        }
        res.status(200).json(posts).sort({ createdAt: -1 })
    } catch (error) {
        res.status(500).json(`Getting all  posts error ${error}`)
    }
})





module.exports = router