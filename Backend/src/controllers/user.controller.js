const followModel = require("../models/follow.model")



async function followUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    const followRecord = await followModel.create({
        follower: followerUsername,
        followee:followeeUsername
    })

    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })

}


module.exports = {
    followUserController
}