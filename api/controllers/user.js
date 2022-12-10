const express = require('express');
const bcrypt = require('bcrypt');
const userCtlr = express.Router();
const { User } = require('../models/index');


 userCtlr.post('/signup', async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10)
    try {
        let user = await User.create (
            Object.assign(req.body, { password: hash })
        );
        
        let data = await user.authorize(user);
        
        return res.json(data);
    } catch(err){
        return res.status(400).send(err);
    }
})

userCtlr.post('/signin',async(req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).send(
            'Request missing email or password'
        );
    }

    try {
        let user = await User.authenticate(email, password)
        
        return res.json(user);
    } catch (err) {
        console.log(err)
        return res.status(400).send('invalid email or password')
    }
});

userCtlr.post('/logout', async(req, res) => {
    const token = req.body.data
    try {
        let remove = await User.logout(token)
        return res.json(remove)
    } catch (err) {
        console.log(err)
        return res.status(400).send('invalid email')
    }
})

module.exports = userCtlr 