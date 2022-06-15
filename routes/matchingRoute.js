const router = require('express').Router()
const objectModel = require('../models/objectModel')
var fuzz = require('fuzzball')

router.get('', async (req, res) => {
    // console.log(params1)
    // let query = params1
    // let choices = params
    let found = await objectModel
        .findById('62a908b38ad39d8118c5f189')
        .populate('refCategory')
    console.log(found)
    let lost = await objectModel
        .find({ statut: 'lost' })
        .populate('refCategory')
    let query = found.formInput
    query['categoryName'] = found.refCategory.name
    let choices = []
    for (let i in lost) {
        let category = lost[i].refCategory
        let par = lost[i].formInput
        par['categoryName'] = category.name
        choices.push(par)
    }
    console.log(choices)
    // function myCustomScorer(query, choice, options) {
    //     if (query.categoryName !== choice.categoryName) return 0
    //     else return fuzz.ratio(query.name, choice.name, options)
    // }

    // let options = { scorer: myCustomScorer }
    // let results = fuzz.extract(query, choices)
    for (let choice of choices) {
        choice.proc_sorted = fuzz.process_and_sort(
            fuzz.full_process(choice.model)
        )
    }
    let options = {
        scorer: fuzz.token_sort_ratio,
        full_process: false
    }
    let results = fuzz.extract(query, choices, options)
    console.log(results)

    res.json(results)
})

module.exports = router
