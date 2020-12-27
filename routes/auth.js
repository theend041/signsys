const router = require('express').Router()
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require('../validation')




router.post('/register', async (req,res) => {

    //Validate data
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Check user already is register
    const emailExist = await userModel.findOne({ email: req.body.email })
    if(emailExist) return res.status(400).send('Email already exist')

    //Hash Passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create a new user
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        await user.save();
        res.status(200).send({
            message: "Registration success",
            user: user.name
        })
    }catch (err) {
        res.status(400).send(err)
    }
})

//Login
router.post('/login', async (req, res) => {
    //Validate data
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking email exsist
    const user = await userModel.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password is wrong')

    //Check password valid
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Password wrong')

   /* //Create and assign token
    const token = jwt.sign({ _id : user._id }, process.env.TOKEN_SECRET)
    res.setHeader('auth-token', token)*/

    res.status(200).send("logged in")
})

module.exports = router


//user json example
/*
res.json({
    status: 'success',
    data: req.body
});*/
