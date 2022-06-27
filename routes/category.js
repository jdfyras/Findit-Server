const router = require('express').Router()
const authAdmin = require('../middleware/authAdmin')
const storage = require('../multerUpload')
const categoryController = require('../controllers/categoryController')

router.post('/addCateogry', storage, categoryController.addCategory)
router.delete('/deleteCateogry/:categoryId', categoryController.deleteCategory)
router.post('/updateCategory/:categoryId', categoryController.updateCategoryName)
router.get('', categoryController.getCategorys)
router.get('/:categoryId', categoryController.getCategory)
router.post(
    '/updateCategoryImage/:categoryId',
    storage,
    categoryController.updateCategoryImage
)
router.get('/formBuilder/:formId', categoryController.getFormByCategory)

module.exports = router
