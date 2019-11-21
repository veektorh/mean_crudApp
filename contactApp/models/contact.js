const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {
        type : String,
        required : true
    },
    phone : String,
    email : String,
    createdBy : String,
    createdUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'ContactAppUser'
    }
})

module.exports = mongoose.model('contact',contactSchema);