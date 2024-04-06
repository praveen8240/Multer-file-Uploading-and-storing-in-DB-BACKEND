const mongoose = require('mongoose')
const ImageSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    file:{
        filename:{
            type:String,
            required:true,
        },
        filepath:{
            type:String,
            required:true,
        }
    }
})

const Image = mongoose.model('Image', ImageSchema)
module.exports = Image