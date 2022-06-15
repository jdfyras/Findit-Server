var fuzz = require('fuzzball')
const objectModel = require('./models/objectModel')

async function isMatch(params1, ...params) {
    // console.log(params1)
    // let query = params1
    // let choices = params
    let found = await objectModel.findById('62a903f4851ce35c3001ddae')
    console.log(found)
    let lost = await objectModel.find({ status: 'lost' })
    let query = found

    let choices = lost

    function myCustomScorer(query, choice, options) {
        if (query.gender !== choice.gender) return 0
        else return fuzz.ratio(query.name, choice.name, options)
    }

    let options = { scorer: myCustomScorer }
    let results = fuzz.extract(query, choices, options)
    console.log(results)
}

isMatch()
