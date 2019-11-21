const express = require('express');
const mongojs = require('mongojs');
const credentials = require('../../config/credentials');

const router = express.Router();
var db = mongojs(credentials.mongoJsConnectionString, ['orders'])


db.on('error', ()=>{
    console.log('we had an error');
});

db.on('connect', ()=>{
    console.log('database connected');
});

router.get('/', (req,res,next)=>{

    db.orders.find(function(err,docs){
        if(err){console.log(err);}
        else{
            res.status(200).json({
               docs : docs
            });
        }
        
    })
})

router.get('/:id', (req,res,next)=>{
        var id = req.params.id;
        console.log(id);
        db.products.find(function(err,docs){
            if(err){console.log(err);}
            else{
                res.status(200).json({
                   docs : docs
                });
            }
            
        })
    })

router.post('/', (req,res,next)=>{
    res.status(200).json({
        message : "Handling POST requests to /products"
    });
})

router.put('/', (req,res,next)=>{
    res.status(200).json({
        message : "Handling POST requests to /products"
    });
})

router.delete('/', (req,res,next)=>{
    res.status(200).json({
        message : "Handling POST requests to /products"
    });
})
module.exports = router;