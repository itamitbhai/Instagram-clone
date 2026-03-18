const postModel = require("../models/post.model")
const Imagekit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");




const imagekit = new Imagekit({
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPostController(req, res) {
    console.log(req.body, req.file)

    const token = req.cookies.token
    
    if(!token) {
        return res.status(401).json({
            message: "Token not Provided, unauthoraized access"
        })
    }
    const decoded = null
    try {
         decoded = jwt.verify(token, process.env.JWT_SECRET)

    } catch (error) {
        return res.status(401).json({
            message: "unauthorized access"
        })
    }
    console.log(decoded)

    const file = await imagekit.files.upload({
    file:await toFile(Buffer.from(req.file.buffer), 'file'),
    fileName: "Test",
    folder: "insta-clone"
})

const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id
})

res.status(201).json({
    message: "Post created succesfully",
    post
})
}



module.exports = {
    createPostController
}