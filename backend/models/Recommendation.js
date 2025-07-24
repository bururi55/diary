const mongoose = require("mongoose");

const RecommendationSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Recommendation = mongoose.model("Recommendation", RecommendationSchema);

module.exports = Recommendation;
