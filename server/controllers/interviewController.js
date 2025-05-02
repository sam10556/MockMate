const { model } = require("../utils/gemini");

exports.analyzeResume = async(req,res) =>{
  const { resumeText } = req.body;
  if (!resumeText)
    return res.status(400).json({ error: "Resume text is required." });

  try {

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
}

exports.generateInterviewQuestions = async (req, res) => {
  const { resumeText} = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  try {

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
};

exports.evaluateAnswer = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required." });
  }

  try {
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
};

exports.finalFeedback = async (req, res) => {
  const { chatHistory } = req.body; // Expect full chat history

  if (!chatHistory || !chatHistory.length) {
    return res.status(400).json({ error: "Chat history is required." });
  }

  try {

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
};
