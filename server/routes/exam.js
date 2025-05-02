const express = require("express");
const { generateMcq, makeNotes } = require("../controllers/examController");
const router = express.Router();

router.post("/generate-multiplechoice-questions",generateMcq);
router.post("/make-notes",makeNotes);

module.exports = router;
