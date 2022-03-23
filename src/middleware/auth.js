const jwt = require('jsonwebtoken')
const User = require('../models/user')


// const isauth = async (req, res, next) =>{
//     try {
//         // const token = req.header('Authorization').replace('Bearer ', '')
//         const token = req.Cookie.access_token
//         const decoded = jwt.verify(token, 'comrade')
//         console.log(decoded._id);
//         const user = await User.findOne({_id:decoded._id})
//         console.log(token);
//         if(!user){
//             throw new Error()
//         }

//         req.token = token
//         req.user = user
//         return next()
//     } catch (e) {
//         res.status(401).send({
//             "error": "Please authenticate"
//         })

//     }
// }

const auth = async (req, res, next)=>{
    const token = req.cookies.token
    if(!token){
        return res.redirect('/login')
    }
    try {
        const data = jwt.verify(token,'comrade')
        req.user = await User.findOne({_id: data._id})
        return next()
    } catch(e){
        res.redirect('/login')
    }  
}

module.exports = auth