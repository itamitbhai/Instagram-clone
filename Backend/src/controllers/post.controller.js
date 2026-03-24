const postModel = require("../models/post.model")
const Imagekit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");




const imagekit = new Imagekit({
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPostController(req, res) {
    console.log(req.body, req.file)


    const file = await imagekit.files.upload({
    file:await toFile(Buffer.from(req.file.buffer), 'file'),
    fileName: "Test",
    folder: "insta-clone"
})

const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id
})

res.status(201).json({
    message: "Post created succesfully",
    post,
})
}



async function getPostController(req, res) {

  
    const userId = req.user.id;

    const posts = await postModel.find({
        user: userId
    })
    res.status(200).json({
        message: "Posts fetch Sucessfully",
        posts
    })
}


async function getPostDetailsController(req, res) {
 

        const userId = req.user.id
        const postId = req.params.postId

        const post = await postModel.findById(postId)

        if(!post) {
            return res.status(404).json({
                message: "Post not Found."
            })

        }
        const isValidUser = post.user === userId
        
        if(!isValidUser){
            return res.status(403).json({
                message :"Forbidden Content."   
            })
        }

        return res.status(200).json({
            message: "Post Fetch Succesfully.",
            post
        })

    


}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
}