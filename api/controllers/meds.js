const express = require('express')
const medsCtlr = express.Router()
const { Post } = require('../models/index')


medsCtlr.get('/', async (req, res) => {
    try {
        const meds = await Post.findAll ({
            where: { tag: "meds"}
        });
        res.json(meds) 
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entries.')
    }
   
})

medsCtlr.get('/latest', async (req, res) => {
    const userId = req.query.userId
     try {
         const meds = await Post.findAll ({
            limit: 1,
            where: { tag: "meds", userId },
            order: [ [ 'updatedAt', 'DESC' ]]
         });
         
         return res.json(meds)
     } catch (error) {
         console.log(error)
         return res.status(400).send('No current entries.')
     }
    
 })

medsCtlr.post('/', async (req, res) => {
    try {
        const meds = await Post.create( req.body )
        return res.json(meds);
    } catch (error) {
        console.log(error)
        return res.status(400).send('Missing required fields')
    }
})

medsCtlr.get('/:id', async (req, res) => {
try {
        const meds = await Post.findByPk( Number(req.params.id))
        return res.json(meds)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }

})

medsCtlr.post('/:id/update', async (req, res) => {
    try {
        var meds = await Post.update( req.body, {
            where: { id: Number(req.params.id) }
        })
        var meds = await Post.findByPk( Number(req.params.id) )
        return res.json(meds)
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

medsCtlr.get('/:id/delete', async (req, res) => {
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

module.exports = medsCtlr