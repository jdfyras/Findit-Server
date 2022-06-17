const router = require('express').Router()
const {
    matching,
    addQuestion,
    answerQuestion
} = require('../controllers/matchingController')

router.post('', matching)
router.get('/addQuestion', addQuestion)
router.get('/answerQuestion', answerQuestion)

module.exports = router
a = {
    _id: { $oid: '62a908b38ad39d8118c5f189' },
    refCategory: { $oid: '62a5ea80d868de52bc8a485f' },
    statut: 'found',
    adress: 'nabeul',
    objectDate: { $date: { $numberLong: '1655164800000' } },
    formInput: { Color: 'gris', Name: 'opp', Description: 'fih tach9ifa ' },
    dateTime: { $date: { $numberLong: '1655244979091' } },
    __v: 0
}
