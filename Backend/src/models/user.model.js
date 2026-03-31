const mongoose = require("mongoose");
const { select } = require("three/tsl");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique:[true, "User name already exists"],
        required: [true, "User name is  required"]
    },
    email:{
        type:String,
        unique:[true, "Email is already exists"],
        required: [true, "Email is  required"]
    },
    password:{
        type:String,
        required: [true, "password is required"],
        select: false
    },
    bio: String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/nruucogyj/images.jpeg"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel