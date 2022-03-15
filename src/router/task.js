const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/tasks')

// This route creates a new task
router.post('/tasks', auth, async (req, res) =>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        task.save()
        res.status(200).send(task)
    } catch(e){
        res.status(400).send( )
    }

})


// This route fetches all task from db
// get/tasks?completed=false
// router.get('/tasks', auth, async (req, res)=>{
//     try{
//         // const task = await Task.find({owner: req.user._id})
//         // const what = req.query.completed
//         const match = {}
//         const sort = {}


//         // filter task
//         if(req.query.completed){
//             match.completed = req.query.completed === 'true'
//         }

//         // Sort task
//         if(req.query.sortBy){
//             const parts = req.query.sortBy.split(':')
//             sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//         }
//         await req.user.populate({
//             path: 'tasks',
//             match,
//             // pagination
//             options:{
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 sort
//             }
//         })
//         // res.send(req.user.tasks)
//         res.render('welcome', {
//             task: req.user.tasks
//         })
//     } catch(e){
//         res.status(500).send(e)
//     }
// })

router.get('/tasks',  auth, async(req, res)=>{
    const task = await Task.find({})
    console.log(req.user);

    res.render('welcome', {
        task : task
    })
})

// This route fetches a single task by its Id from the db
router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }

})

// update tasks
router.patch('/tasks/:id', auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates= ['task', 'completed']
    const isValidOperation = updates.every(update =>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send('error! You cannot update what does not exist ')
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send
        }
        
        updates.forEach((update) =>{
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } 
    catch(e){
        res.status(404).send(e)
    }
})


// Delete Task
router.delete('/tasks/:id', auth, async (req, res)=>{
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id : req.params.id, owner: req.user._id}) 
        
        if(!task){
            return res.status(404).send('Task not found!!')
        }

        res.send(`${task.task} was deleted!!!`)
         
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/mine', (req, res)=>{
    res.render('welcome')
})


module.exports = router