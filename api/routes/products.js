const express = require('express');
const mongoose = require('mongoose');
const credentials = require('../../config/credentials');
const bodyParser = require('body-parser');
const Product = require('../models/products');

const router = express.Router();

router.get('/', (req, res, next) => {
    getAll(req, res);
})

router.get('/:id', (req, res, next) => {
    getById(req,res)
})

router.post('/', (req, res, next) => {
    add(req,res);
})

router.put('/', (req, res, next) => {
    updateOne(req,res)
})

router.delete('/:id', (req, res, next) => {
    deleteOne(req, res);
})

function add(req, res) {
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save()
        .then((result) => {

            console.log(result);

            res.status(201).json({
                message: "products was created succesfully",
                status: "success",
                product: result
            });

        }).catch((err) => {
            res.status(500).json("internal server error");
        })
}

function getById(req,res){
    var id = req.params.id;
    
        Product.findById(id)
            .then((result) => {
                if (result)
                    res.status(200).json(result);
                else
                    res.status(404).json('Not Found');
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            })
}

function getAll(req, res) {
    Product.find((err, docs) => {
        if (err) {
            res.status(500).json('internal server error')
        } else {
            res.status(200).json(docs);
        }
    })
}

function deleteOne(req, res) {
    var id = req.params.id;
    Product.deleteOne({ _id: id }, (err, docs) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(docs);
        }
    })
}

function updateOne(req,res){
    var product = req.body;
    
    Product.updateOne({_id : product._id} , {$set:product}, (err,result) =>{
        if(err)
            res.status(500).json(err);
        else
            res.status(200).json(result);
    })
}
module.exports = router;