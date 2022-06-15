const router = require('express').Router()
const objectModel = require('../models/objectModel')
var fuzz = require('fuzzball')

router.get('', async (req, res) => {
    let found = await objectModel
        .findById('62a908b38ad39d8118c5f189')
        .populate('refCategory')
    console.log(found)
    let lost = await objectModel
        .find({ statut: 'lost', refCategory: found.refCategory })
        .populate('refCategory')
    let query = found.formInput
    query['id'] = found.id

    let choices = []
    for (let i in lost) {
        let par = lost[i].formInput
        par['id'] = lost[i].id
        choices.push(par)
    }
    console.log(choices)
    
    function myCustomScorer(query, choice, options) {
        let processorQuery = ''
        let processorChoice = ''
        for (let elem in choice) {
            console.log(elem)
            if (elem !== 'id') {
                processorQuery += query[`${elem}`]
                processorChoice += choice[`${elem}`]
            }
        }

        return fuzz.ratio(processorQuery, processorChoice, {
            returnObjects: true
        })
    }

    let options = { scorer: myCustomScorer, returnObjects: true }
    let results = fuzz.extract(query, choices, options)
    console.log(results)
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const abortController = new AbortController()

    options.abortController = abortController
    options.asyncLoopOffset = 64

    fuzz.extractAsPromised('gonna get aborted', choices, options)
        .then((res) => {
            /* do stuff */
        })
        .catch((e) => {
            if (e.message === 'aborted') console.log('I got aborted!')
        })

    abortController.abort()
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    res.json(results)
})

module.exports = router
