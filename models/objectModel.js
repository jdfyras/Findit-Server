const mongoose = require("mongoose");
const objectSchema = new mongoose.Schema({
  statut: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: date.now()
  },
  refCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
}
});

module.exports = mongoose.model("object", objectSchema);
