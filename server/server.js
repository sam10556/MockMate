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

    const prompt = `Resume Text :""${resumeText}""
    List a few interview questions based on the resume text using this JSON schema:

    Questions = {'questions': string}
    Return: Array<Questions>`;

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
  const { resumeText} = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Function to create prompt
    const createPrompt = (text, count) => `
Analyze the following document and generate ${count} multiple-choice questions based on the key topics.
Ensure that the questions cover different aspects of the document and are not repetitive.

Return the questions in this structured JSON format:
[
  {
    "question": "What is the candidate's primary programming language?",
    "options": ["A. Java", "B. Python", "C. JavaScript", "D. C++"],
    "answer": "B"
  }
]

Resume Text:
"""${text}"""
`;

    // Split the resumeText roughly in half
    const midpoint = Math.floor(resumeText.length / 2);
    const splitIndex = resumeText.lastIndexOf(" ", midpoint); // Split at nearest space
    const part1 = resumeText.slice(0, splitIndex);
    const part2 = resumeText.slice(splitIndex);

    const questionCountPerPart = resumeText.length < 2500 ? 3 : resumeText.length < 5000 ? 4 : 5;

    const prompt1 = createPrompt(part1, questionCountPerPart);
    const prompt2 = createPrompt(part2, questionCountPerPart);

    // Generate content for both parts
    const [response1, response2] = await Promise.all([
      model.generateContent(prompt1),
      model.generateContent(prompt2),
    ]);

    const textResponse1 =
      response1?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const textResponse2 =
      response2?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const combinedText = `${textResponse1}\n${textResponse2}`;
    
    const codeBlocks = combinedText.match(/```json([\s\S]*?)```/g);
    if (!codeBlocks || codeBlocks.length === 0) {
      throw new Error("No valid JSON code blocks found in AI response.");
    }
    
    let parsedQuestions = [];
    
    for (const block of codeBlocks) {
      try {
        const jsonStr = block.replace(/```json|```/g, "").trim();
        const questionsPart = JSON.parse(jsonStr);
        if (Array.isArray(questionsPart)) {
          parsedQuestions = parsedQuestions.concat(questionsPart);
        }
      } catch (err) {
        console.warn("Skipping malformed block:", err.message);
      }
    }
    
    res.json({ questions: parsedQuestions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({
      error: "Error generating questions",
      details: error.message,
    });
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

app.post("/make-notes", async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Document text is required" });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let prompt = `Make short but important notes of this document text ${resumeText}. make points-clean and clear so it can be understood easily`;

    const response = await model.generateContent(prompt);

    const textResponse =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("AI response is empty or malformed.");
    }

    res.json({ notes: textResponse });
  } catch (error) {
    console.error("Error generating notes:", error);
    res
      .status(500)
      .json({ error: "Error generating notes", details: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
