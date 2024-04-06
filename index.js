const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const Image = require('./models/Image.js')
const fs = require('fs');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,req.body.username+".jpeg");
    }
})

const upload = multer({storage : storage})

const app=express()
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/profileLogin', async (req, res) => {
    try {
        const username = req.query.username;
        // Assuming `Image` is your mongoose model
        const user = await Image.findOne({ username });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const imagePath = user.file.filepath;
        // Read the image file
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error("Error reading image file:", err);
                return res.status(500).send("Error reading image file");
            }
            // Set the content type to image/jpeg or image/png depending on your image type
            res.contentType('image/jpeg');
            // Send the image data in the response
            res.send(data);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.post('/upload',upload.single('image'),async(req, res) => {

    try{
        const mongoInsert = Image({
            username: req.body.username,
            file:{
                filename: req.file.filename,
                filepath: req.file.path,
            }
        })
        const response= await mongoInsert.save();
        console.log(response)
    }catch(err){
        console.log(err)
        res.send(err)
    }
    res.send("uploaded image")
})

mongoose.connect("mongodb://localhost:27017/multer")

const db = mongoose.connection

app.listen(7777,console.log("server 7777"));


app.get('/',(req, res) => {
    res.render("upload")
})

