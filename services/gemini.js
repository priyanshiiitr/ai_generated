const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gradeEssay(essayText) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are an expert essay grader. Analyze the following essay based on these criteria: 
      1. Clarity and Coherence
      2. Grammar and Spelling
      3. Structure and Organization
      4. Argument Strength and Evidence

      Provide a score out of 10 and a brief, constructive justification for the score. 
      
      Your response MUST be a valid JSON object with the following structure: 
      { "score": <number>, "feedback": "<string>" }
      
      Do not include any other text or markdown formatting outside of this JSON object.

      Essay to grade:
      ---
      ${essayText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text to ensure it's a valid JSON string
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the JSON string into an object
    const gradedResult = JSON.parse(cleanedText);

    return gradedResult;

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    // Re-throw the error to be handled by the route controller
    throw new Error('Failed to get a response from the AI model.');
  }
}

module.exports = { gradeEssay };
