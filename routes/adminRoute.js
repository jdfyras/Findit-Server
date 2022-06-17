const express = require('express')
const router = express.Router()

const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getProfil,
    updateAdmin,
    deleteAdmin,
    getusers,
    updateUser,
    deleteUser
} = require('../controllers/adminConroller')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.delete('/logout/:userId', logoutAdmin)
router.get('/profil/:userId', getProfil)
router.put('/update/:userId', updateAdmin)
router.delete('/delete/:userId', deleteAdmin)
router.get('/getUsers/:userId', getusers)
router.put('/updateUser/:userId', updateUser)
router.delete('/deleteUser/:userId', deleteUser)

module.exports = router
