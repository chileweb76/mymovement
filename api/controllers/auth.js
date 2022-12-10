const express = require('express')
const authCtlr = express.Router()
const { LoginToken } = require('../models/index')

authCtlr.get('/token', async (req, res) => {
    const token = await LoginToken.findOne({where: {
      token: req.headers.token
    }})
    if (token) {
      res.json(token)
    } else {
      res.json({ token: false })
    }
  })
  
  module.exports = authCtlr