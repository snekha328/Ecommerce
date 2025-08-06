const uploadController = require('express').Router()

const multer = require('multer')
//const {verifyToken} = require('../middleware/verifyToken')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"upload/images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.filename)
    }
})

const upload = multer({
    storage
})

uploadController.post('/image',upload.single('image'),(req,res)=>{
    try {
        return res.status(201).json({msg:"Successfully upload"})
    } catch (error) {
        console.error(error)
    }
})


module.exports = uploadController