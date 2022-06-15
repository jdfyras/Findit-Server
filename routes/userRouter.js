const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')

const storage = require('../multerUpload')

router.post('/register', userCtrl.register)

router.post('/activation', userCtrl.activateEmail)

router.post('/login', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', userCtrl.resetPassword)

router.get('/infor', userCtrl.getUserInfor)

router.get('/all_infor', userCtrl.getUsersAllInfor)

router.get('/logout', userCtrl.logout)

router.patch('/update', userCtrl.updateUser)

router.patch('/update_role/:id', userCtrl.updateUsersRole)

router.delete('/delete/:_id', userCtrl.deleteUser)

// Social Login
router.post('/google_login', userCtrl.googleLogin)

router.post('/facebook_login', userCtrl.facebookLogin)

module.exports = router
