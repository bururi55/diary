const express = require("express");
const { getRecommendations } = require("../controllers/recommendation");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json({ data: recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
