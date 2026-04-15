const postModel = require("../models/post.model")
const Imagekit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model")




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

// async function likePostController(req, res) {
//     const username= req.user?.username
//     const postId = req.params.postId

//     const post = await postModel.findById(postId)

//     if(!post) {
//         return res.status(404).json({
//             message: "Post not Found"
//         })
//     }

//       const existingLike = await likeModel.findOne({
//       post: postId,
//       user: username
//     })

//     if (existingLike) {
//       return res.status(400).json({
//         message: "Already liked"
//       })
//     }

//     const like = await likeModel.create({
//         post: postId,
//         user: username
//     })

//     res.status(201).json({
//         message: "Post liked Succesfully",
//         like
//     })

    

// }
async function likePostController(req, res) {
    try {
        const username = req.user?.username;
        const postId = req.params.postId;

        console.log("USER:", req.user);
        console.log("POST ID:", postId);

        if (!username) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        if (!postId) {
            return res.status(400).json({
                message: "Post ID missing"
            });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not Found"
            });
        }

        const existingLike = await likeModel.findOne({
            post: postId,
            user: username
        });

        if (existingLike) {
            return res.status(400).json({
                message: "Already liked"
            });
        }

        const like = await likeModel.create({
            post: postId,
            user: username
        });

        res.status(201).json({
            message: "Post liked successfully",
            like
        });

    } catch (error) {
        console.log("LIKE ERROR:", error);  // 🔥 THIS WILL SHOW REAL ISSUE
        res.status(500).json({
            message: error.message
        });
    }
}


async function unLikePostController(req, res) {
    try {
        const username = req.user?.username;
        const postId = req.params.postId;

        // 🔒 Auth check
        if (!username) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        if (!postId) {
            return res.status(400).json({
                message: "Post ID missing"
            });
        }

        // 🔍 Check post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // 🔍 Find like
        const existingLike = await likeModel.findOne({
            post: postId,
            user: username
        });

        if (!existingLike) {
            return res.status(400).json({
                message: "You have not liked this post"
            });
        }

        // ❌ Delete like
        await likeModel.deleteOne({
            post: postId,
            user: username
        });

        res.status(200).json({
            message: "Post unliked successfully"
        });

    } catch (error) {
        console.log("UNLIKE ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

async function getFeedController(req, res) {
    const user = req.user


    const posts = await Promise.all((await postModel.find({}).sort({_id: -1}).populate("user").lean())
       .map(async (post) => {

        /**
         * typeof post => Object
         */

        const isLiked = await likeModel.findOne({
            user:user.username,
            post:post._id
        })
        post.isLiked = Boolean(isLiked)

        return post
       }))

    res.status(200).json({
        message:"posts fetched succesfully",
        posts
    })
}


module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unLikePostController
}