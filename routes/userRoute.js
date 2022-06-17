const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser,
    getuser,
    updateUser,
    deleteUser
} = require('../controllers/userController')

router.post('/register/', registerUser)
router.post('/login/', loginUser)
router.delete('/logout/:userId', logoutUser)
router.get('/profil/:userId', getuser)
router.put('/update/:userId', updateUser)
router.delete('/delete/:userId', deleteUser)

module.exports = router
