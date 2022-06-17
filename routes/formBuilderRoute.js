const express = require('express')
const router = express.Router()
const { addForm, getForm } = require('../controllers/formBuilderController')

router.post('/addForm/:userId', addForm)
router.get('/getForm/:userId', getForm)

module.exports = router
