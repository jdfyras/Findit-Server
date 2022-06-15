const FormBuilder = require('../models/formBuilder')

exports.addForm = async (req, res, next) => {
    try {
        let savedFormBuilder = new FormBuilder(req.body)
        savedFormBuilder = await savedFormBuilder.save()
        res.status(200)
        res.send(savedFormBuilder)
    } catch (error) {
        console.error(error)
        return error
    }
}
exports.load = async (req, res, next) => {
    try {
        const formBuilder = await FormBuilder.find()
        res.send(formBuilder)
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}
