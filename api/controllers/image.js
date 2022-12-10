const express = require('express')
const imageCtlr = express.Router()
const { Image } = require('../models/index')

imageCtlr.post('/', async (req, res) => {
    try {
        const image = await Image.create( req.body )
        return res.json(image);
    } catch (error) {
        console.log(error)
        return res.status(400).send('Missing required fields')
    }
})

imageCtlr.get('/:id', async (req, res) => {
    try {
            const image = await Post.findByPk( Number(req.params.id))
            return res.json(image)
        } catch (error) {
            console.log(error)
            return res.status(400).send('No current entry by id.')
        }
})

imageCtlr.get('/:id/delete', async (req, res) => {
    try {
        const deleted = await Image.destroy({
            where: { id: Number(req.params.id)}
        })
        console.log("deleted")
    } catch (error) {
        console.log(error)
        return res.status(400).send('No current entry by id.')
    }
})

module.exports = imageCtlr