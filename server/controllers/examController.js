const { model } = require("../utils/gemini");

exports.generateMcq = async(req,res)=>{
    const { resumeText} = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  try {
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
}

exports.makeNotes = async(req,res) =>{
    const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Document text is required" });
  }
  try {
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
}