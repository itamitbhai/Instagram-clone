const express = require('express')
const authController = require("../controllers/auth.controller")
const identifyUser = require("../middleware/auth.middleware")

const authRouter = express.Router()

/**
 * post  /api/auth/register
*/


authRouter.post('/register',authController.registerController)

/**
 * post  /api/auth/register
*/
authRouter.post('/login', authController.loginController)

/**
 * @route Get /api/auth/get-me
 * @desc get the curently logges in users information
 * @access private
 */

authRouter.get("/get-me",identifyUser, authController.getMeController)


module.exports = authRouter;