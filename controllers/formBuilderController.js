const formBuilderModel = require('../models/formBuilderModel')
const adminModel = require('../models/adminModel')
module.exports = {
    addForm: async (req, res) => {
        try {
            let { userId } = req.params
            const admin = await adminModel.findById({ _id: userId })
            if (!admin)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'addForm failed.Please try again.'
                })
            let savedFormBuilder = new formBuilderModel(req.body)
            savedFormBuilder = await savedFormBuilder.save()
            res.status(200)
            res.json({
                success: true,
                message: `addForm successfully !. `,
                userId: userId,
                name: admin.name,
                email: admin.email,
                isConnected: admin.isConnected,
                formBuilder: savedFormBuilder
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: error.message
            })
        }
    },
    getForm: async (req, res) => {
        try {
            let { userId } = req.params
            const admin = await adminModel.findById({ _id: userId })
            if (!admin)
                return res.status(400).json({
                    success: false,
                    userId: req.params.userId,
                    message: 'addForm failed.Please try again.'
                })
            const formBuilder = await formBuilderModel.find()
            res.json({
                success: true,
                message: `Update successfully !. `,
                userId: userId,
                name: admin.name,
                email: admin.email,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
                isConnected: admin.isConnected,
                formBuilder
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                success: false,
                userId: req.params.userId,
                message: error.message
            })
        }
    }
}
