const express = require('express')
const User = require('../models/user')
const router = require('express').Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')


router.get('/', (req,res)=>{
    res.redirect('/login')
})

// This route creates a new user
router.route('/users')
.get((req,res)=>{
    res.render('user/sign-up')
})
.post(bodyParser.urlencoded({extended:true}), async (req, res) =>{
    let user = new User(req.body)
    try{
        await user.save()
        // const token = await user.generateAuthToken()
        console.log('User created successfully');
        res.redirect('/login')
    }
    catch(e){
        res.status(400).send(e)
    }

})

// This route fetches all users from db
router.get('/users/me', auth, async (req, res) =>{
    res.send(req.user)
})


// This routes fetches as single user by its Id
router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById({_id})
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }
    catch(e){
        res.status(500).send()
    }
})


// Update User
router.patch('/users/me', auth, async(req, res) =>{
    // Set ediatble parameter and sending appropriate status code
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send('error : Cannot update!')
    }
    
    try{
        updates.forEach((update) =>{
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send(req.user)
    }
    catch (e){
        res.status(404).send()
    }
    
})

// Delete user
router.delete('/users/me', auth, async(req, res) =>{
    try{
        await req.user.remove()
        res.send(`${req.user.name} was deleted!!!`)
    }catch(e){
        	res.status(400).send()
    }
})

// Login
router.route('/login')
.get((req, res)=>{
    res.render('user/login')
})
.post(bodyParser.urlencoded({extended:true}), async (req, res) =>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // const token = await user.generateAuthToken()
        console.log(user);
        const token = jwt.sign({ _id: user._id.toString()},'comrade', {expiresIn: '1hr'})
        res.cookie("token", token)
        res
        .status(200)
        .redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
}) 
 

// Logout
router.get('/logout', auth, async (req, res) =>{
    return res
    .clearCookie('token')
    .redirect('/login')
})


// // Remove All Sessions
// router.post('/users/logoutAll', auth, async (req, res)=>{
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.status(200).send('All Sessions removed')
//     } catch (e) {
//         res.status(500).send()
//     }
// })

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Upload an image file'))
        }

        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save() 
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router