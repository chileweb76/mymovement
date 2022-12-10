const express = require('express');
const bcrypt = require('bcrypt');
const forgotpwdCtlr= express.Router();
const { User } = require('../models/index');

