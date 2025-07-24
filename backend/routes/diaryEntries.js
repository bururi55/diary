const express = require("express");
const {
  createDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
} = require("../controllers/diaryEntry");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.post("/", authenticated, async (req, res) => {
  try {
    const diaryEntry = await createDiaryEntry(req.user._id, req.body);
    res.send({ data: diaryEntry });
  } catch (error) {
    console.error("Error creating diary entry:", error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/", authenticated, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { entries, lastPage } = await getDiaryEntries(
      req.user._id,
      Number(page),
      Number(limit)
    );
    res.send({ data: { entries, lastPage } });
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).send({ error: error.message });
  }
});

router.patch("/:id", authenticated, async (req, res) => {
  try {
    const diaryEntry = await updateDiaryEntry(req.params.id, req.body);
    res.send({ data: diaryEntry });
  } catch (error) {
    console.error("Error updating diary entry:", error);
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", authenticated, async (req, res) => {
  try {
    await deleteDiaryEntry(req.params.id);
    res.send({ data: { message: "Diary entry deleted successfully" } });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
