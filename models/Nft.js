const mongoose = require('mongoose')


const NftSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,

    },
    desc: {
        type: String,
        required: true,

    },
    picture: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    category: {
        type: Array,

    }

}, { timestamps: true })
module.exports = mongoose.model("Nft", NftSchema)