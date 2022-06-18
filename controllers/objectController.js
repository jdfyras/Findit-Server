const createError = require('http-errors')
const objectModel = require('../models/objectModel')
const categoryModel = require('../models/Category.Model')
module.exports = {
    addObject: async (req, res, next) => {
        try {
            const exist = await categoryModel.findOne({
                name: req.body.categoryName
            })
            if (!exist) return res.status(400).send('Invalid Category.')

            const object = new objectModel({
                refCategory: {
                    _id: exist._id
                },
                refUser: {
                    userId: req.body.userId
                },
                statut: req.body.statut,
                adress: req.body.adress,
                objectDate: req.body.objectDate,
                formInput: req.body.formInput
            })
            const savedObject = await object.save()
            res.send({ savedObject })
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    getAllObjects: async (req, res, next) => {
        try {
            const objects = await objectModel
                .find({ refUser: req.body.userId })
                .populate('refCategory')
                .select()
            console.log(objects)
            return res.json(objects)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    getObjectByCategory: async (req, res, next) => {
        try {
            const object = await objectModel
                .find({ refCategory: req.params.id, refUser: req.body.userId })
                .populate('refCategory')
                .select()
            return res.json(object)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    getObject: async (req, res, next) => {
        try {
            const object = await objectModel
                .findOne({
                    refUser: req.params.userId
                })
                .populate('refCategory')
                .select()
            console.log(object)
            if (!object) {
                throw createError.NotFound('object not found')
                // res.status(NOT_FOUND).json({ err: 'object not found' })
            }
            return res.json(object)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    updateObject: async (req, res, next) => {
        try {
            const object = await objectModel.findOneAndUpdate(
                { _id: req.params.id, refUser: req.body.userId },
                req.body,
                { new: true }
            )
            console.log(object)
            if (!object)
                return res
                    .status(404)
                    .send('The object with the given ID was not found.')

            return res.json(object)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    },
    deleteObject: async (req, res, next) => {
        try {
            const object = await objectModel.findOneAndRemove({
                _id: req.params.id,
                refUser: req.body.userId
            })
            if (!object) return res.status(404).send('could not delete object ')

            return res.json(object)
        } catch (error) {
            if (error.isJoi === true) error.status = 422

            console.log(error)
            next(error)
        }
    }
}
