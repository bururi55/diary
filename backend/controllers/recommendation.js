const Recommendation = require("../models/Recommendation");

async function getRecommendations() {
  try {
    const recommendations = await Recommendation.find({});
    return recommendations;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  getRecommendations,
};
