const express = require('express')
const moodCtlr = express.Router()
const { Post } = require('../models/index')


moodCtlr.get('/', async (req, res) => {
   
    try {
        const mood = await Post.findAll ({
            where: { tag: "mood"}
        });
        res.json(mood) 
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entries.')
    }
   
})

moodCtlr.get('/latest', async (req, res) => {
    const userId = req.query.userId
     try {
         const mood = await Post.findAll ({
            limit: 1,
            where: { tag: "mood", userId },
            order: [ [ 'updatedAt', 'DESC' ]]
         });
         
         return res.json(mood)
     } catch (error) {
         console.log(error)
         return res.status(400).send('No current entries.')
     }
    
 })

moodCtlr.post('/', async (req, res) => {
    try {
        const mood = await Post.create( req.body )
        return res.json(mood);
    } catch (error) {
        console.log(error)
        return res.status(400).send('Missing required fields')
    }
})

moodCtlr.get('/:id', async (req, res) => {
try {
        const mood = await Post.findByPk( Number(req.params.id))
        return res.json(mood)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }

})

moodCtlr.post('/:id/update', async (req, res) => {
    try {
        var mood = await Post.update( req.body, {
            where: { id: Number(req.params.id) }
        })
        var mood = await Post.findByPk( Number(req.params.id) )
        return res.json(mood)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

moodCtlr.get('/:id/delete', async (req, res) => {
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

module.exports = moodCtlr