// const userModel = require('../Models/userModel')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

exports.getUsers = (req, res, next) => {
    userModel.find((err, data) => {
        if (err) {
            res.send('no Data found')
        } else {
            res.status(200).send(data)
        }
    })
}
exports.deleteUser = (req, res, next) => {
    userModel
        .findByIdAndRemove({ _id: req.params._id })
        .then((ra) => {
            res.send(ra)
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.addUser = (req, res, next) => {
    /*if(!req.file){
        const error = new Error('no Image Provided');
        throw error ;
    }*/
    //const imageUrl = req.file.path
    let password = req.body.password
    bcrypt.hash(password, 12).then((hashedPassword) => {
        const respo = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        respo.save((err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                console.log('Error in save' + JSON.stringify(err, undefined, 2))
            }
        })
    })
}
exports.getUser = (req, res, next) => {
    const _id = req.params._id
    userModel.findById({ _id: _id }, (err, data) => {
        if (err) {
            res.send('no Data Found')
        } else {
            res.send(data)
        }
    })
}
exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser
    userModel
        .findOne({ email: email })
        .then((User) => {
            if (!User) {
                const error = new Error(
                    'An responsabale with this email could not be found'
                )
                error.statusCode = 401
                throw error
            }
            loadedUser = User
            return bcrypt.compare(password, User.password)
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error('Wrong Password')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'Keytaaserveurlezemikounitwil',
                { expiresIn: '1h' }
            )
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.checkPassword = (req, res, next) => {
    const password = req.body.oldPassword
    const HashedPassword = req.body.HashedPassword
    bcrypt.compare(password, HashedPassword).then((isEqual) => {
        if (!isEqual) {
            console.log('kk')
            res.json({ worked: 'false' })
        } else {
            res.json({ worked: 'true' })
        }
    })
}
exports.updateProfile = (req, res, next) => {
    const _id = req.body._id
    bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
        userModel
            .findByIdAndUpdate(
                { _id },
                {
                    password: hashedPassword
                }
            )
            .then((res) => {
                console.log(res)
            })
    })
}
