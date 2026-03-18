const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({Storage: multer.memoryStorage()})
/**
 * post /api/posts [protected]
 * -req.body = {caption, image-file}
 */

postRouter.post("/", upload.single("image"), postController.createPostController)


module.exports = postRouter