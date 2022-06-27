const router = require('express').Router()

const {
    addObject,
    deleteObject,
    updateObject,
    getObject,
    getObjectByCategory,
    getAllObjects
} = require('../controllers/objectController.js')

router.post('/addObject', addObject)
router.delete('/deleteObject/:userId', deleteObject)
router.put('/updateObject/:userId', updateObject)
router.get('/getObject/:userId', getObject)
router.get('/getObjectByCategory/:userId', getObjectByCategory)
router.get('/getAllObjects', getAllObjects)
// router.get('', getObject)

module.exports = router
