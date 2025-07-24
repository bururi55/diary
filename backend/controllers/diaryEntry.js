const DiaryEntry = require("../models/DiaryEntry");

async function createDiaryEntry(userId, entryData) {
  try {
    const diaryEntry = new DiaryEntry({
      userId,
      ...entryData,
    });
    await diaryEntry.save();
    return diaryEntry;
  } catch (error) {
    console.error("Error creating diary entry:", error);
    throw error;
  }
}

async function getDiaryEntries(userId, page = 1, limit = 10) {
  try {
    const diaryEntries = await DiaryEntry.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products.productId");

    const totalEntries = await DiaryEntry.countDocuments({ userId });
    const lastPage = Math.ceil(totalEntries / limit);

    return { entries: diaryEntries, lastPage };
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    throw error;
  }
}

async function updateDiaryEntry(entryId, entryData) {
  try {
    const diaryEntry = await DiaryEntry.findByIdAndUpdate(entryId, entryData, {
      new: true,
    });
    return diaryEntry;
  } catch (error) {
    console.error("Error updating diary entry:", error);
    throw error;
  }
}

async function deleteDiaryEntry(entryId) {
  try {
    await DiaryEntry.findByIdAndDelete(entryId);
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    throw error;
  }
}

module.exports = {
  createDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
};
