const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const userValidationSchema = {
    username : Joi.string().required(),
    email : Joi.string().required().email(),
    password : Joi.string().required(),
    confirmpassword : Joi.any().valid(Joi.ref('password')).options({ language : { any : {allowOnly : 'and password do not match'}}})
}

const loginValidationSchema = {
    username : Joi.string().required(),
    password : Joi.string().required()
}



router.get('/login', (req,res,next) => {
    
    res.render('contactApp/user/login', {
        form : {},
        errors : null,
        errstatus : req.flash('error')[0],
        success : req.flash('success')[0],
    })

});

router.post('/login', (req,res,next) => {
    
    let validationResult = Joi.validate(req.body,loginValidationSchema);

    if(validationResult.error){
        
        return res.render('contactApp/user/login', {
            form : req.body,
            errors : validationResult.error.details,
            success : null,
            errstatus : null
        })

    }

    passport.authenticate('local', (err, user , info)=>{

        if(err){
            //return next(err);
            req.flash('error','An error occured');
            return res.redirect('/contactApp/user/login')
        }

        if(!user){
            req.flash('error','invalid username or password');
            return res.redirect('/contactApp/user/login');
        }

        

        req.login(user, (err) => {
            if(err){
                req.flash('error','An error occured');
                return res.redirect('/contactApp/user/login')
            }

            res.redirect('/contactApp')
        })
    })(req,res,next)

});

router.get('/register', (req,res,next) => {

    res.render('contactApp/user/register', {
        errors : null,
        form : {},
        success : req.flash('success')[0],
        errstatus : null
    })

});

router.post('/register', (req,res,next) =>{

    const validationResult = Joi.validate(req.body,userValidationSchema);
    
    if(validationResult.error){
        console.log(validationResult.error.details[0].message);
         return res.render('contactApp/user/register', {
             errors : validationResult.error.details,
             form : req.body,
             success : null,
             errstatus : null
         })
    }

    let newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    bcrypt.genSalt(10, (err,salt)=>{
        if(err){
            return res.render('contactApp/user/register', {
                errors : null,
                form : req.body,
                success : null,
                errstatus : 'An error occured'
            })
        }

        bcrypt.hash(req.body.password,salt, (err,hash) => {
            if(err){
                return res.render('contactApp/user/register', {
                    errors : null,
                    form : req.body,
                    success : null,
                    errstatus : 'An error occured'
                })
            }

            newUser.password = hash;

            newUser.save((err,doc)=>{

                if(err){
                    return res.render('contactApp/user/register', {
                        errors : null,
                        form : req.body,
                        success : null,
                        errstatus : 'An error occured'
                    })
                }
                
                req.flash('success', 'Registration successful !');
                res.redirect('/contactApp/user/register');
            })
        })
    })
    

});

router.get('/logout', (req,res,next) => {
    req.logout();
    req.flash('error', 'you are logged out')
    res.redirect('/contactApp/user/login')

});

module.exports = router;