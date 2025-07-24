const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/users", require("./user"));
router.use("/settings", require("./settings"));
router.use("/recommendations", require("./recommendations"));
router.use("/products", require("./products"));
router.use("/diary", require("./diaryEntries"));

module.exports = router;
