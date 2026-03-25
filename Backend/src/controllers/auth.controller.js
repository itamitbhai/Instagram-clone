 const userModel = require('../models/user.model')
 const bcrypt = require("bcryptjs");
 const jwt = require('jsonwebtoken')
 
 async function registerController (req, res) {
    const {email, username, password, bio, profileImage} = req.body

    // const isUserExistsByEmail = await userModel.findOne({ email })

    // if(isUserExistsByEmail){
    //     return res.status(409).json({
    //         message: "User already exists with send email"
    //     })
    // }

    // const isUserExistsByUsername = await userModel.findOne({ username })

    // return res.status(409).json({
    //     message: "Username already exists"
    // })

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "User already exists" + (isUserAlreadyExists.email ==
                email ? "Email already exists" : "Username already exists")
        })
    }

    // const hash = crypto.createHash('sha256').update(password).digest('hex')

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash

    })

    /**
     * -user la data hona chaiye 
     * -data unique hona chahiye
     */

    const token = jwt.sign(
        {
         id:user._id,
         username: user.username
       },
       process.env.JWT_SECRET, {expiresIn : "1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }

    })  


}
 
 async function loginController (req, res) {
    const {username, email, password} = req.body
    /**
     * username
     * password
     * 
     * email
     * password
     */

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    })
    if(!user) {
        return res.status(404).json({
            message: "User not Found"
        })
    }
    // const hash = crypto.createHash('sha256').update(password).digest('hex')
   const isPasswordValid = await bcrypt.compare(password, user.password)
    // const isPasswordValid = hash == user.password

    if(!isPasswordValid){
        return res.status(401).json({
            message: "password invalid"
        })
    }
    const token = jwt.sign(
        {
            id:user._id,
            username:user.username,
        }, process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    res.cookie("token", token)

    res.status(200).json({
        message: "LoginIN succesfully",
        user: {
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })

}

module.exports = {
    registerController,
    loginController
}