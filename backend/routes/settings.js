const express = require("express");
const {
  getSettingsByUserId,
  updateSettings,
} = require("../controllers/settings");
const authenticated = require("../middlewares/authenticated");
const router = express.Router({ mergeParams: true });

router.get("/", authenticated, async (req, res) => {
  try {
    const settings = await getSettingsByUserId(req.user._id);
    res.send({ data: settings });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/", authenticated, async (req, res) => {
  try {
    const updatedSettings = await updateSettings(req.user._id, req.body);
    res.send({ data: updatedSettings });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
