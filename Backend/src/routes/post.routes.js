const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage: multer.memoryStorage()})
const identifyUser = require("../middleware/auth.middleware")
/**
 * post /api/posts [protected]
 * -req.body = {caption, image-file}
 */

postRouter.post("/", upload.single("image"), identifyUser , postController.createPostController)


/**
 * 
 * Delete /api/postId
 * -req.body = delete
 */

postRouter.delete("/:postId", identifyUser, postController.deletePostController)
/**
 * @routes GET /api/posts/ [protected]
 */
postRouter.get("/",identifyUser, postController.getPostController)

/**
 * @routes GET /api/posts/details/:postid
 *@description  -return an detail about specific post with the id. also 
 * check whether the post belongs to the user that the request come from 
 * 
 */

postRouter.get("/details/:postId",identifyUser, postController.getPostController)

/**
 * @routes POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params 
 */

postRouter.post("/like/:postId", identifyUser, postController.likePostController)
postRouter.post("/unlike/:postId", identifyUser, postController.unLikePostController)


/**
 * @routes Get/api/posts/feed
 * @description get all the post created in the db
 * @access Private
 */

postRouter.get("/feed", identifyUser, postController.getFeedController)

/**
 * @routes POST /api/posts/comment/:postId
 * @description add comment to a post
 * @access Private
 */
postRouter.post("/comment/:postId", identifyUser, postController.addCommentController)

/**
 * @routes GET /api/posts/comment/:postId
 * @description get all comments of a post
 * @access Private
 */
postRouter.get("/comment/:postId", identifyUser, postController.getCommentsController)

module.exports = postRouter