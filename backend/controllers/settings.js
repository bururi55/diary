const Settings = require("../models/Settings");

async function getSettingsByUserId(userId) {
  return await Settings.findOne({ userId });
}

async function updateSettings(userId, settingsData) {
  return await Settings.findOneAndUpdate({ userId }, settingsData, {
    new: true,
    upsert: true,
  });
}

module.exports = {
  getSettingsByUserId,
  updateSettings,
};
