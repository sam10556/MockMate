require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 1️⃣ PDF Upload & Text Extraction
app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.pdf)
    return res.status(400).json({ error: "No file uploaded." });

  try {
    const pdfData = await pdfParse(req.files.pdf);
    res.json({ text: pdfData.text });
  } catch (error) {
    res.status(500).json({ error: "Error processing PDF" });
  }
});

// 🔹 2️⃣ Generate Interview Questions
app.post("/generate-interview-questions", async (req, res) => {
  const { resumeText, mode } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `\n${resumeText}\n`;

    prompt +=
      "Generate 5 interview question based on the candidate's skills and experience.";

    const response = await model.generateContent(prompt);
    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    let questions = textResponse.split("\n").filter((q) => q.trim());

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res
      .status(500)
      .json({ error: "Error generating questions", details: error.message });
  }
});

app.post("/generate-multiplechoice-questions", async (req, res) => {
  const { resumeText, mode } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `Analyze this resume:\n${resumeText}\n`;
    prompt += `Based on the candidate’s skills and experience, generate **10 multiple-choice questions** in the following structured format:

1. **Question**: Clearly state the question.
2. **Options**: Provide four options labeled A, B, C, and D.
3. **Answer**: Indicate the correct answer using the format: **Answer: X** (where X is A, B, C, or D).

Ensure that the output is well-organized and follows this format for each question.`;

    const response = await model.generateContent(prompt);
    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    let questions = textResponse.split("\n").filter((q) => q.trim());

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res
      .status(500)
      .json({ error: "Error generating questions", details: error.message });
  }
});

/**
 * Analyze Resume
 */
app.post("/analyze-resume", async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText)
    return res.status(400).json({ error: "Resume text is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this Resume:\n${resumeText}\nProvide key strengths, improvement areas, and job recommendations.`;

    const response = await model.generateContent(prompt);
    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    res.json({ analysis: textResponse });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res
      .status(500)
      .json({ error: "Error analyzing resume", details: error.message });
  }
});

// 🔹 3️⃣ Evaluate User Answers
app.post("/evaluate-answer", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Evaluate this response:\nQuestion: ${question}\nAnswer: ${answer}\nProvide a concise evaluation.`;

    const response = await model.generateContent(prompt);

    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    res.json({ evaluation: textResponse.trim() });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res
      .status(500)
      .json({ error: "Error evaluating answer", details: error.message });
  }
});

// 🔹 4️⃣ Generate Final Feedback
app.post("/final-feedback", async (req, res) => {
  const { chatHistory } = req.body; // Expect full chat history

  if (!chatHistory || !chatHistory.length) {
    return res.status(400).json({ error: "Chat history is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    prompt = `Given the following interview session:\n${JSON.stringify(
      chatHistory,
      null,
      2
    )}
      \nEvaluate the candidate's performance by analyzing their responses to each question. Provide a structured final feedback summary that includes:
      - Strengths
      - Weaknesses
      - Areas to improve
      - Overall impression of the candidate.`;

    const response = await model.generateContent(prompt);
    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    res.json({ feedback: textResponse });
  } catch (error) {
    console.error("Error generating final feedback:", error);
    res.status(500).json({
      error: "Error generating final feedback",
      details: error.message,
    });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
