const express = require('express');
const userController = require("../controllers/user.controller")
const identifyUser = require("../middleware/auth.middleware")

const userRouter = express.Router();
const upload = require("../middleware/upload")   // 👈 ऊपर import


/**
 * @route Post /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */

userRouter.post("/follow/:username", identifyUser, userController.followUserController)

/**
 * @route Post /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */

userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)

/**
 * @route Post /api/users/follow/respond/id
 * @description Follow a user
 * @access Private
 */
userRouter.post("/follow/respond/:username", identifyUser, userController.respondToFollowController)

userRouter.put(
  "/edit",
  identifyUser,
  upload.single("profileImage"),   // 🔥 यही यहाँ लगता है
  userController.updateProfileController
)

module.exports = userRouter;