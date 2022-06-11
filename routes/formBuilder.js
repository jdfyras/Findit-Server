const router = require('express').Router()
const fromBuilderController = require('../controllers/formBuilder')

router.post('', fromBuilderController.addForm)
router.get('', fromBuilderController.load)

module.exports = router
