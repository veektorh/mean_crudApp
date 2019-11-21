const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Joi = require('joi');
const url = require('url');

const contact = require('../models/contact');

const conttactValidationSchema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(5).max(15).required(),
    email: Joi.string().required().email()
}

//index
router.get('/', checkAuth, (req, res, next) => {
    let status = req.query.status || '';

    let query = { createdBy: req.user._id }

    contact.find(query)
        .populate('createdUser', 'username')
        .exec()
        .then((docs) => {
            console.log(docs)
            res.render('contactApp/index', {
                errors: null,
                status: req.flash('status')[0],
                form: {},
                contacts: docs
            });
        })
        .catch((err) => {
            res.render('contactApp/index', {
                errors: null,
                status: "error",
                form: {},
                contacts: null
            });
        })



})

//add contact
router.get('/add', checkAuth, (req, res, next) => {
    let status = req.query.status || "";


    res.render('contactApp/add', {
        status: status,
        errors: null,
        form: {}
    });
})


router.post('/add', checkAuth, (req, res, next) => {

    let body = req.body;
    let validatResult = Joi.validate(body, conttactValidationSchema);

    if (validatResult.error) {

        return res.render('contactApp/add', {
            errors: validatResult.error.details,
            form: body
        });


    }

    let contacts = new contact({
        _id: new mongoose.Types.ObjectId(),
        name: body.name,
        phone: body.phone,
        email: body.email,
        createdBy: req.user._id,
        createdUser: req.user._id
    })


    contacts.save((err, docs) => {
        if (err) {
            console.log(err);
            req.flash('status', 'error');
            res.redirect('/contactApp')
        } else {
            req.flash('status', 'success');
            res.redirect('/contactApp');
        }

    })

})

//edit contact
router.get('/edit/:id', checkAuth, (req, res, next) => {
    let id = req.params.id;

    contact.find({ _id: id }, (err, docs) => {
        if (err) {
            return res.redirect('/');
        }
        return res.render('contactApp/edit', {
            errors: null,
            form: docs[0]
        });
    })


})

router.post('/edit/:id', checkAuth, (req, res, next) => {
    let id = req.params.id;
    let query = { _id: req.params.id };

    let validatResult = Joi.validate(req.body, conttactValidationSchema);

    if (validatResult.error) {
        req.body._id = id;
        return res.render('contactApp/edit', {
            errors: validatResult.error.details,
            form: req.body
        });


    }

    contact.findOneAndUpdate(query, req.body, (err, docs) => {
        if (err) {
            console.log("error");
            return res.redirect('/ContactApp');
        }
        req.flash('status', 'success');
        return res.redirect('/contactApp')
    })


})

//delete
router.post('/delete', checkAuth, (req, res, next) => {

    contact.findOneAndDelete({ _id: req.body.id }, (err, docs) => {
        if (err) {
            console.log(err);
            res.json("error");
        } else {
            res.json('success');
        }

    })


})

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('error', 'please log in');
        res.redirect('/contactApp/user/login')
    }
}
module.exports = router;