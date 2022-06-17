const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')

module.exports = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password)
                return res
                    .status(400)
                    .json({ msg: 'Please fill in all fields.' })

            if (!validateEmail(email))
                return res.status(400).json({ msg: 'Invalid emails.' })

            const user = await userModel.findOne({ email })
            if (user)
                return res
                    .status(400)
                    .json({ msg: 'This email already exists.' })

            if (password.length < 6)
                return res
                    .status(400)
                    .json({ msg: 'Password must be at least 6 characters.' })

            const newUser = new userModel(req.body)
            const savedUse = await newUser.save()
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
            return res.status(500).json({ msg: err.message })
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body
            if (!validateEmail(email))
                return res.status(400).json({ msg: 'Invalid emails.' })

            const user = await userModel.findOne({ email })
            if (!user)
                return res.status(400).json({
                    success: false,
                    message: 'Login In failed.Please try again.'
                })

            const isMatch = await user.isValidPassword(password)
            if (!isMatch)
                return res.status(400).json({ msg: 'Password is incorrect.' })

            await userModel.findByIdAndUpdate(
                { _id: user._id },
                {
                    isConnected: true
                }
            )
            res.json({
                success: true,
                message: `Login success!. Welcome ${user.name}`,
                userId: user._id,
                isAdmin: user.isAdmin,
                isConnected: true
            })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    logoutUser: async (req, res) => {
        try {
            let { userId } = req.params
            const user = await userModel.findByIdAndUpdate(
                { _id: userId },
                {
                    isConnected: false
                }
            )
            res.json({
                success: true,
                message: `Logout success!. Goodbye ${user.name}`,
                isConnected: false
            })
        } catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    registerAdmin: async (req, res) => {
        try {
            let { name, email, password } = req.body

            if (!name || !email || !password)
                return res
                    .status(400)
                    .json({ msg: 'Please fill in all fields.' })

            if (!validateEmail(email))
                return res.status(400).json({ msg: 'Invalid emails.' })

            const admin = await adminModel.findOne({ email })
            if (admin)
                return res
                    .status(400)
                    .json({ msg: 'This email already exists.' })

            if (password.length < 6)
                return res
                    .status(400)
                    .json({ msg: 'Password must be at least 6 characters.' })

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
            return res.status(500).json({ msg: err.message })
        }
    },
    loginAdmin: async (req, res) => {
        try {
            let { email, password } = req.body
            if (!validateEmail(email))
                return res.status(400).json({ msg: 'Invalid emails.' })

            const admin = await adminModel.findOne({ email })
            if (!admin)
                return res.status(400).json({
                    success: false,
                    message: 'Login In failed.Please try again.'
                })

            const isMatch = await admin.isValidPassword(password)
            if (!isMatch)
                return res.status(400).json({ msg: 'Password is incorrect.' })

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
    }
}

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
