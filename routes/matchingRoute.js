const router = require('express').Router()
const {
    matching,
    getMatching,
    addQuestion,
    answerQuestion
} = require('../controllers/matchingController')

router.post('/:userId', matching)
router.get('/:userId', getMatching)
router.post('/addQuestion/:userId', addQuestion)
router.put('/answerQuestion/:userId', answerQuestion)

module.exports = router
