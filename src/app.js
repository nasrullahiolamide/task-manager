const express = require('express')
const app = express()
const path = require('path')
require('./db/mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')
const bodyParser = require('body-parser')
const hbs = require('hbs')


app.use(express.json())
app.use(userRouter)
app.use(taskRouter) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../public')))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))




module.exports = app