const mongoose = require("mongoose");

const DiaryEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sugarLevel: {
    type: Number,
    required: true,
  },
  shortInsulinValue: {
    type: Number,
    required: true,
  },
  longInsulinValue: {
    type: Number,
  },
  totalBreadUnits: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      grams: {
        type: Number,
        required: true,
      },
    },
  ],
});

const DiaryEntry = mongoose.model("DiaryEntry", DiaryEntrySchema);

module.exports = DiaryEntry;
