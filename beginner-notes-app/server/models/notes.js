const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        maxLength:100
    },
    description:{
        type:String,
        maxLength:500
    },
}, {
    timestamps:true
});

module.exports = mongoose.model('Notes', notesSchema);