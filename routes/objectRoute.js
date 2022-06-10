const router = require("express").Router();

const {
  addObject,
  deleteObject,
  updateObject,
  getObject,
} = require("../controllers/objectController.js");

router.post("/addObject", addObject);
router.delete("/deleteObject/:_id", deleteObject);
router.post("/updateObject/:_id", updateObject);
router.get("", getObject);

module.exports = router;
