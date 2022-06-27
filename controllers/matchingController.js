const createError = require('http-errors')
const objectModel = require('../models/objectModel')
const validationQuestion = require('../models/validationQuestion')
const matchingModel = require('../models/matching')
const categoryModel = require('../models/Category.Model')
const userModel = require('../models/userModel')

var fuzz = require('fuzzball')
module.exports = {
    matching: async (req, res, next) => {
        try {
            let { userId } = req.params
            let { objectId } = req.body
            const user = await userModel
                .findById({ _id: userId })
                .select('-password -_id -__v')
            if (!user)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'user not found'
                })
            let found = await objectModel
                .findById({ _id: objectId })
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
            if (results && results.length > 0) {
                var lostObject = results[0].choice.id
                let rs = new matchingModel({
                    results,
                    foundObject: objectId,
                    lostObject
                })
                await rs.save()
            }
            res.json(results)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    getMatching: async (req, res, next) => {
        try {
            const matching = await matchingModel.findOne({
                foundObject: req.body.objectId
            }).populate('foundObject lostObject')
            if (!matching)
                return res
                    .status(404)
                    .send('The matching with the given ID was not found.')
            return res.json(matching)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    addQuestion: async (req, res, next) => {
        try {
            const object = await matchingModel.findOne({
                foundObject: req.body.objectId
            })
            if (!object)
                return res
                    .status(404)
                    .send('The object with the given ID was not found.')
            const valid = new validationQuestion({
                question: req.body.question,
                refMatching: object._id
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
            const object = await matchingModel.findOne({
                lostObject: req.body.objectId
            })
            if (!object)
                return res
                    .status(404)
                    .send('The object with the given ID was not found.')
            const savedAnswer = await validationQuestion.findOneAndUpdate(
                {
                    refMatching: object._id
                },
                { answer: req.body.answer }
            )
            // res.send({ savedQuestion })
            return res.json(savedAnswer)
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
