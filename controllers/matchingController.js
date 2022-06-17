const createError = require('http-errors')
const objectModel = require('../models/objectModel')
const validationQuestion = require('../models/validationQuestion')
const matchingModel = require('../models/matching')
const categoryModel = require('../models/Category.Model')
var fuzz = require('fuzzball')
module.exports = {
    matching: async (req, res, next) => {
        try {
            let found = await objectModel
                .findById('62a908b98ad39d8118c5f18c')
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
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    addQuestion: async (req, res, next) => {
        try {
            const object = await objectModel.findOne({
                _id: req.params.objectId,
                refUser: req.body.userId,
                statut: 'found'
            })
            if (!object)
                return res
                    .status(404)
                    .send('The object with the given ID was not found.')
            const valid = new validationQuestion({
                question: req.body.question,
                foundObject: req.body.objectId
            })
            const savedQuestion = await valid.save()
            // res.send({ savedQuestion })
            return res.json(savedQuestion)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    answerQuestion: async (req, res, next) => {
        try {
            const object = await objectModel.findOne({
                _id: req.params.objectId,
                refUser: req.body.userId,
                statut: 'lost'
            })
            if (!object)
                return res
                    .status(404)
                    .send('The object with the given ID was not found.')
            const valid = new validationQuestion({
                question: req.body.question,
                foundObject: req.body.objectId
            })
            const savedQuestion = await valid.save()
            // res.send({ savedQuestion })
            return res.json(savedQuestion)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    }
}
var myCustomScorer = (query, choice, options) => {
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
