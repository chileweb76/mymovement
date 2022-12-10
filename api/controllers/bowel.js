const express = require('express')
const bowelCtlr = express.Router()
const { Post } = require('../models/index')


bowelCtlr.get('/', async (req, res) => {
    try {
        const bowel = await Post.findAll ({
            where: { tag: "bowel"}
        });
        res.json(bowel) 
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entries.')
    }
   
})

bowelCtlr.get('/latest', async (req, res) => {
    const userId = req.query.userId
     try {
         const bowel = await Post.findAll ({
            limit: 1,
            where: { tag: "bowel", userId },
            order: [ [ 'updatedAt', 'DESC' ]]
         });
         
         return res.json(bowel)
     } catch (error) {
         console.log(error)
         return res.status(400).send('No current entries.')
     }
    
 })

bowelCtlr.post('/', async (req, res) => {
    try {
        const bowel = await Post.create( req.body )
        return res.json(bowel);
    } catch (error) {
        console.log(error)
        return res.status(400).send('Missing required fields')
    }
})

bowelCtlr.get('/:id', async (req, res) => {
try {
        const bowel = await Post.findByPk( Number(req.params.id))
        return res.json(bowel)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }

})

bowelCtlr.post('/:id/update', async (req, res) => {
    try {
        var bowel = await Post.update( req.body, {
            where: { id: Number(req.params.id) }
        })
        var bowel = await Post.findByPk( Number(req.params.id) )
        return res.json(bowel)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

bowelCtlr.get('/:id/delete', async (req, res) => {
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

module.exports = bowelCtlr