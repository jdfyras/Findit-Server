require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const createError = require('http-errors')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(cors())
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use('/image', express.static(path.join('image')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))
require('./helpers/mongoDBConfig')

/* 
app.use(fileUpload({
    useTempFiles: true
}))
*/
// Routes
app.use('/admin', require('./routes/adminRoute'))
app.use('/user', require('./routes/userRoute'))
app.use('/form', require('./routes/formBuilderRoute'))

// app.use('/auth', require('./routes/authRoute'))
app.use('/utilisateur', require('./routes/userRoute'))
app.use('/category', require('./routes/category'))
app.use('/object', require('./routes/objectRoute'))
app.use('/match', require('./routes/matchingRoute'))
//app.use('/api', require('./routes/upload'))

// Connect to mongodb
// const URI = process.env.MONGODB_URL
// mongoose.connect(
//     URI,
//     {
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     },
//     (err) => {
//         if (err) throw err
//         console.log('Connected to mongodb')
//     }
// )

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
//     })
// }
app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
