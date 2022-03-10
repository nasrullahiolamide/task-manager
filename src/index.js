const express = require('express')
const app = express()
const port = process.env.PORT
require('./db/mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter) 
 

app.listen(port, () =>{
    console.log(`Server is running on Port: ${port} `);
})