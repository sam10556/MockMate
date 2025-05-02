const express = require("express");
const router = express.Router();
const {
  generateInterviewQuestions,
  evaluateAnswer,
  finalFeedback,
  analyzeResume,
} = require("../controllers/interviewController");

router.post("/generate-interview-questions", generateInterviewQuestions);
router.post("/evaluate-answer", evaluateAnswer);
router.post("/final-feedback", finalFeedback);
router.post("/analyze-resume", analyzeResume);

module.exports = router;
