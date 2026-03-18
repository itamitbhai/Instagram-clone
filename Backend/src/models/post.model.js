const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        require: [true, "imgUrl is required for creating an post"]
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "users",
        required : [true, "imgUrl is required for creating an post"]
    }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel