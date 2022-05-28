require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const path = require('path')


const app = express()
app.use(cors());
app.use('/images',express.static(path.join('images')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser())
/* 
app.use(fileUpload({
    useTempFiles: true
}))
*/
// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/category',require('./routes/category'))
app.use('/form',require('./routes/formBuilder'))
//app.use('/api', require('./routes/upload'))


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})