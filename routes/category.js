const router = require('express').Router()
const authAdmin = require('../middleware/authAdmin')
const storage = require('../multerUpload')
const categoryController = require('../controllers/categoryController')

router.post('/addCateogry', storage, categoryController.addCategory)
router.delete('/deleteCateogry/:_id', categoryController.deleteCategory)
router.post('/updateCategory/:_id', categoryController.updateCategoryName)
router.get('', categoryController.getCategorys)
router.get('/:_id', categoryController.getCategory)
router.post(
    '/updateCategoryImage/:_id',
    storage,
    categoryController.updateCategoryImage
)
router.get('/formBuilder/:_id', categoryController.getFormByCategory)

module.exports = router
