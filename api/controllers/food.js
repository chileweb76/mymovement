const express = require('express')
const foodCtlr = express.Router()
const { Post } = require('../models/index')



foodCtlr.get('/', async (req, res) => {
   const userId = req.query.userId
    try {
        const food = await Post.findAll ({
            where: { tag: "food", userId }
        });
        
        return res.json(food)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entries.')
    }
   
})

foodCtlr.get('/latest', async (req, res) => {
    const userId = req.query.userId
     try {
         const food = await Post.findAll ({
            limit: 1,
            where: { tag: "food", userId },
            order: [ [ 'updatedAt', 'DESC' ]]
         });
         
         return res.json(food)
     } catch (error) {
         console.log(error)
         return res.status(400).send('No current entries.')
     }
    
 })

foodCtlr.post('/', async (req, res) => {
    try {
        const food = await Post.create( req.body )
        console.log(req.body)
        return res.json(food);
    } catch (error) {
        console.log(error)
        return res.status(400).send('Missing required fields')
    }
})

foodCtlr.get('/:id', async (req, res) => {
try {
        const food = await Post.findByPk( Number(req.params.id))
        return res.json(food)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }

})

foodCtlr.post('/:id/update', async (req, res) => {
    try {
        var food = await Post.update( req.body, {
            where: { id: Number(req.params.id) }
        })
        var food = await Post.findByPk( Number(req.params.id) )
        return res.json(food)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

foodCtlr.get('/:id/delete', async (req, res) => {
    try {
        const deleted = await Post.destroy({
            where: { id: Number(req.params.id)}
        })
        console.log("deleted")
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

module.exports = foodCtlr