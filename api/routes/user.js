const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req,res,next)=>{
    res.json("get register route");
    
})

module.exports = router;