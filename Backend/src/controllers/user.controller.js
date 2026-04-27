const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

// ✅ FOLLOW
async function followUserController(req, res) {
    try {
        const followerId = req.user._id
        const followeeUsername = req.params.username

        const followeeUser = await userModel.findOne({ username: followeeUsername })

        if (!followeeUser) {
            return res.status(404).json({ message: "User not found" })
        }

        if (String(followerId) === String(followeeUser._id)) {
            return res.status(400).json({ message: "You cannot follow yourself" })
        }

        const existing = await followModel.findOne({
            follower: followerId,
            followee: followeeUser._id
        })

        if (existing) {
            return res.status(200).json({
                message: existing.status === "pending"
                    ? "Follow request already sent"
                    : "Already following",
                follow: existing
            })
        }

        const followRecord = await followModel.create({
            follower: followerId,
            followee: followeeUser._id,
            status: "accepted"   // 🔥 public = "accepted"
        })

        res.status(201).json({
            message: "Follow request sent",
            follow: followRecord
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


// ✅ UNFOLLOW
async function unfollowUserController(req, res) {
    try {
        const followerId = req.user._id
        const followeeUsername = req.params.username

        const followeeUser = await userModel.findOne({ username: followeeUsername })

        if (!followeeUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const deleted = await followModel.findOneAndDelete({
            follower: followerId,
            followee: followeeUser._id
        })

        if (!deleted) {
            return res.status(200).json({
                message: "You are not following this user"
            })
        }

        res.status(200).json({
            message: "Unfollowed successfully"
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


// ✅ RESPOND (ACCEPT / REJECT)
async function respondToFollowController(req, res) {
    try {
        const followeeId = req.user._id
        const followerUsername = req.params.username
        const { action } = req.body   // accepted / rejected

        if (!["accepted", "rejected"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action"
            })
        }

        const followerUser = await userModel.findOne({ username: followerUsername })

        if (!followerUser) {
            return res.status(404).json({
                message: "Follower not found"
            })
        }

        const follow = await followModel.findOne({
            follower: followerUser._id,
            followee: followeeId,
            status: "pending"
        })

        if (!follow) {
            return res.status(404).json({
                message: "Follow request not found"
            })
        }

        if (action === "rejected") {
            await followModel.findByIdAndDelete(follow._id)

            return res.status(200).json({
                message: "Follow request rejected"
            })
        }

        // accepted
        follow.status = "accepted"
        await follow.save()

        res.status(200).json({
            message: "Follow request accepted",
            follow
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function updateProfileController(req, res) {
    try {
        const userId = req.user._id
        const { bio } = req.body

        console.log("FILE:", req.file)
        console.log("BODY:", req.body)

        let updateData = {}

        if (bio) updateData.bio = bio

        // 🔥 FILE HANDLE
        if (req.file) {
            updateData.profileImage =
                "http://localhost:3000/uploads/" + req.file.filename
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )

        res.json({
            message: "Profile updated",
            user
        })

    } catch (err) {
        console.log("UPDATE ERROR:", err)
        res.status(500).json({
            message: err.message
        })
    }
}
module.exports = {
    followUserController,
    unfollowUserController,
    respondToFollowController,
    updateProfileController
}