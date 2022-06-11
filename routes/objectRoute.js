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
router.delete('/deleteObject/:id', deleteObject)
router.put('/updateObject/:id', updateObject)
router.get('/getObject/:id', getObject)
router.get('/getObjectByCategory/:id', getObjectByCategory)
router.get('/getAllObjects', getAllObjects)
// router.get('', getObject)

module.exports = router
