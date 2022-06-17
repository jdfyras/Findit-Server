const router = require('express').Router()
const {
    matching,
    addQuestion,
    answerQuestion
} = require('../controllers/matchingController')

router.get('', matching)
router.get('/addQuestion', addQuestion)
router.get('/answerQuestion', answerQuestion)

module.exports = router
