const mongoose = require("mongoose");

const SettingsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  insulinCoefficient: {
    type: Number,
    required: true,
    default: 1.5,
  },
  compensationCoefficient: {
    type: Number,
    required: true,
    default: 1.2,
  },
  targetSugar: {
    type: Number,
    required: true,
    default: 5.5,
  },
  dailyDoseOfInsulin: {
    type: Number,
    required: true,
    default: 30,
  },
  weight: {
    type: Number,
    required: true,
    default: 70,
  },
  birthDate: {
    type: Date,
    required: true,
    default: new Date("2000-01-01"),
  },
  rounding: {
    type: String,
    required: true,
    default: "off",
  },
  carbohydratesIn1Unit: {
    type: Number,
    required: true,
    default: 10,
  },
  severeHypoglycemia: {
    type: Number,
    required: true,
    default: 2.8,
  },
  hypoglycemia: {
    type: Number,
    required: true,
    default: 3.9,
  },
  normalGlucose: {
    type: Number,
    required: true,
    default: 5.5,
  },
  hyperglycemia: {
    type: Number,
    required: true,
    default: 7.0,
  },
  severeHyperglycemia: {
    type: Number,
    required: true,
    default: 11.0,
  },
  precoma: {
    type: Number,
    required: true,
    default: 16.5,
  },
});

const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;
