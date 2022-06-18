const router = require('express').Router()
const {
    matching,
    addQuestion,
    answerQuestion
} = require('../controllers/matchingController')

router.post('/:userId', matching)
router.post('/addQuestion/:userId', addQuestion)
router.put('/answerQuestion/:userId', answerQuestion)

module.exports = router
