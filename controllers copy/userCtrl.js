// const userModel = require('../models/userModel')
const sendMail = require('./sendMail'),
    { env } = require('process')

module.exports = {
    register: async (req, res) => {
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
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(
                activation_token,
                env.ACTIVATION_TOKEN_SECRET
            )

            const { name, email, password } = user

            const check = await userModel.findOne({ email })
            if (check)
                return res
                    .status(400)
                    .json({ msg: 'This email already exists.' })

            const newUser = new userModel({
                name,
                email,
                password
            })

            await newUser.save()

            res.json({ msg: 'Account has been activated!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
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
                isAdmin: user.isAdmin
            })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token)
                return res.status(400).json({ msg: 'Please login now!' })

            jwt.verify(rf_token, env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err)
                    return res.status(400).json({ msg: 'Please login now!' })

                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await userModel.findOne({ email })
            if (!user)
                return res
                    .status(400)
                    .json({ msg: 'This email does not exist.' })

            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, 'Reset your password')
            res.json({ msg: 'Re-send the password, please check your email.' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            console.log(password)
            const passwordHash = await bcrypt.hash(password, 12)

            await userModel.findOneAndUpdate(
                { _id: req.user.id },
                {
                    password: passwordHash
                }
            )

            res.json({ msg: 'Password successfully changed!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await userModel
                .findById(req.user.id)
                .select('-password')

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            const users = await userModel.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            const { userId } = req.params
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
    updateUser: async (req, res) => {
        try {
            const { name } = req.body
            await userModel.findOneAndUpdate(
                { _id: req.user.id },
                {
                    name
                }
            )

            res.json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body

            await userModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    role
                }
            )

            res.json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await userModel.findByIdAndDelete(req.params.id)

            res.json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body

            const verify = await client.verifyIdToken({
                idToken: tokenId,
                audience: env.MAILING_SERVICE_CLIENT_ID
            })

            const { email_verified, email, name, picture } = verify.payload

            const password = email + env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if (!email_verified)
                return res
                    .status(400)
                    .json({ msg: 'Email verification failed.' })

            const user = await userModel.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch)
                    return res
                        .status(400)
                        .json({ msg: 'Password is incorrect.' })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: 'Login success!' })
            } else {
                const newUser = new Users({
                    name,
                    email,
                    password: passwordHash,
                    avatar: picture
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: 'Login success!' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL)
                .then((res) => res.json())
                .then((res) => {
                    return res
                })

            const { email, name, picture } = data

            const password = email + env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await userModel.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch)
                    return res
                        .status(400)
                        .json({ msg: 'Password is incorrect.' })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: 'Login success!' })
            } else {
                const newUser = new Users({
                    name,
                    email,
                    password: passwordHash,
                    avatar: picture.data.url
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: 'Login success!' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
