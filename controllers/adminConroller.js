const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
module.exports = {
    registerAdmin: async (req, res) => {
        try {
            let { name, email, password } = req.body

            if (!name || !email || !password)
                return res.status(400).json({
                    success: false,
                    message: 'Please fill in all fields.'
                })

            if (!validateEmail(email))
                return res
                    .status(400)
                    .json({ success: false, message: 'Invalid emails.' })

            const admin = await adminModel.findOne({ email })
            if (admin)
                return res.status(400).json({
                    success: false,
                    message: 'This email already exists.'
                })

            if (password.length < 6)
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters.'
                })

            const newAdmin = new adminModel(req.body)
            const savedUse = await newAdmin.save()
            if (savedUse)
                res.json({
                    success: true,
                    userId: savedUse._id,
                    isAdmin: savedUse.isAdmin
                })
            else
                res.json({
                    success: false,
                    message: 'Registration failed.'
                })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    loginAdmin: async (req, res) => {
        try {
            let { email, password } = req.body
            if (!validateEmail(email))
                return res
                    .status(400)
                    .json({ success: false, message: 'Invalid emails.' })

            const admin = await adminModel.findOne({ email })
            if (!admin)
                return res.status(400).json({
                    success: false,
                    message: 'Login In failed.Please try again.'
                })

            const isMatch = await admin.isValidPassword(password)
            if (!isMatch)
                return res
                    .status(400)
                    .json({ success: false, message: 'Password is incorrect.' })

            await adminModel.findByIdAndUpdate(
                { _id: admin._id },
                {
                    isConnected: true
                }
            )
            res.json({
                success: true,
                message: `Login success!. Welcome ${admin.name}`,
                userId: admin._id,
                isAdmin: admin.isAdmin,
                userName: admin.name,
                email: admin.email,
                isConnected: true
            })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    logoutAdmin: async (req, res) => {
        try {
            let { userId } = req.params
            const admin = await adminModel.findByIdAndUpdate(
                { _id: userId },
                {
                    isConnected: false
                }
            )
            res.json({
                success: true,
                message: `Logout success!. Goodbye ${admin.name}`,
                isConnected: false
            })
        } catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    getProfil: async (req, res) => {
        try {
            let { userId } = req.params
            const user = await adminModel.findById({ _id: userId })
            //.select('-password -_id -__v')
            if (!user)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'user not found'
                })
            res.json({
                success: true,
                userId: userId,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isConnected: user.isConnected
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    },
    updateAdmin: async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Update failed.Please try again.'
                })
            let { userId } = req.params
            let query = {}
            if (req.body.password) {
                if (!req.body.oldPassword)
                    return res.status(400).json({
                        success: false,
                        userId: req.params.userId,
                        message: 'old Password is required.'
                    })
                let admin = await adminModel.findById({ _id: userId })
                const isMatch = await admin.isValidPassword(
                    req.body.oldPassword
                )

                if (!isMatch)
                    return res.status(400).json({
                        success: false,
                        userId: req.params.userId,
                        message: 'old Password is incorrect.'
                    })
                let salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(
                    req.body.password,
                    salt
                )
                query['password'] = hashedPassword
            }
            if (req.body.name) {
                query['name'] = req.body.name
            }
            if (req.body.email) {
                query['email'] = req.body.email
            }

            const admin = await adminModel.findByIdAndUpdate(
                { _id: userId },
                query
            )
            if (!admin)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Update failed.Please try again.'
                })
            let newAdmin = await adminModel.findById({ _id: userId })
            //.select('-password -_id -__v')
            res.json({
                success: true,
                message: `Update successfully !. `,
                userId: userId,
                name: newAdmin.name,
                email: newAdmin.email,
                createdAt: newAdmin.createdAt,
                updatedAt: newAdmin.updatedAt,
                isConnected: newAdmin.isConnected
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    },
    deleteAdmin: async (req, res) => {
        try {
            let { userId } = req.params
            const admin = await adminModel.findByIdAndDelete({ _id: userId })
            if (!admin)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Delete failed.Please try again.'
                })
            res.json({
                success: true,
                message: `Delete successfully !. `,

                isConnected: false
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    },
    getusers: async (req, res) => {
        try {
            let { userId } = req.params
            const users = await userModel
                .find()
                //.select('-password  -__v')
                .sort({ isConnected: -1 })

            if (!users)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'user not found'
                })
            res.json({
                success: true,
                userId: userId,
                users
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    },
    updateUser: async (req, res) => {
        try {
            var admin = await adminModel.findById({ _id: req.params.userId })
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Update failed.Please try again.'
                })
            var { userId } = req.body
            let query = {}
            if (req.body.password) {
                let salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(
                    req.body.password,
                    salt
                )
                query['password'] = hashedPassword
            }
            if (req.body.name) {
                query['name'] = req.body.name
            }
            if (req.body.email) {
                query['email'] = req.body.email
            }

            const user = await userModel.findByIdAndUpdate(
                { _id: userId },
                query
            )
            if (!user)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Update failed.Please try again.'
                })
            let newUser = await userModel.findById({ _id: userId })
            //.select('-password  -__v')
            res.json({
                success: true,
                message: `Update successfully !. `,
                userId: admin._id,
                name: admin.name,
                email: admin.email,

                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
                isConnected: admin.isConnected,
                updatedUser: {
                    userId: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                    isConnected: newUser.isConnected
                }
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    },
    addUser: async (req, res) => {
        try {
            var admin = await adminModel.findById({ _id: req.params.userId })
            if (!req.body || !admin) {
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Update failed.Please try again.'
                })
            }
            const { name, email, password } = req.body

            if (!name || !email || !password)
                return res.status(400).json({
                    success: false,
                    message: 'Please fill in all fields.'
                })

            if (!validateEmail(email))
                return res
                    .status(400)
                    .json({ success: false, message: 'Invalid emails.' })

            const user = await userModel.findOne({ email })
            if (user)
                return res.status(400).json({
                    success: false,
                    message: 'This email already exists.'
                })

            if (password.length < 6)
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters.'
                })

            const newUser = new userModel(req.body)
            const savedUse = await newUser.save()
            if (savedUse)
                res.json({
                    success: true,
                    userId: req.params.userId,
                    user: savedUse
                })
            else
                res.json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Add user  failed.'
                })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            let admin = await adminModel.findById({ _id: req.params.userId })
            let { userId } = req.body
            const user = await userModel.findByIdAndDelete({ _id: userId })
            if (!user)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'Delete failed.Please try again.'
                })
            res.json({
                success: true,
                message: `Delete successfully !. `,
                userId: admin._id,
                name: admin.name,
                email: admin.email,

                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
                isConnected: admin.isConnected
            })
        } catch (err) {
            console.error(err)

            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: err.message
            })
        }
    }
}

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
