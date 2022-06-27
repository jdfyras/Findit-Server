const category = require('../models/Category.Model')
const formBuilderModel = require('../models/formBuilderModel')

exports.addCategory = async (req, res, next) => {
    try {
        const newCategory = new category({
            name: req.body.name,
            image: 'http://localhost:5000/image/' + req.file.filename,
            formId: req.body.formId
        })
        const response = await newCategory.save()

        res.status(201).send(response)
    } catch (err) {
        console.error(err)
        res.send(err)
    }
}
exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const response = await category.findByIdAndDelete(categoryId)
        res.status(201).send(response)
        //TODO DELETE IMAGE
    } catch (err) {
        console.error(err)
        res.send(err)
    }
}
exports.updateCategoryName = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const categoryy = await category.findByIdAndUpdate(categoryId, {
            name: req.body.name
        })
        res.status(201).send({ message: 'updated' })
    } catch (err) {
        console.error(err)
        res.send(err)
    }
}
exports.updateCategoryImage = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const response = await category.findByIdAndUpdate(categoryId, {
            image: 'http://localhost:5000/image/' + req.file.filename
        })
        res.status(201).send({ message: 'updated' })
    } catch (err) {
        console.error(err)
    }
}
exports.getCategorys = async (req, res, next) => {
    try {
        const rs = await category.find().populate('formId')
        console.table(rs)
        res.status(201).json(rs)
    } catch (err) {
        console.error(err)
        res.send(err)
    }
}
exports.getCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const cat = await category.findById(categoryId).populate('formId')
        res.status(201).send(cat)
    } catch (err) {
        console.error(err)
        console.log(err)
        res.send(err)
    }
}
exports.getFormByCategory = async (req, res, next) => {
    try {
        const formId = req.params.formId
        const cat = category.find({ formId: formId })
        res.send(cat)
    } catch (err) {
        console.error(err)
        res.send(err)
    }
}
