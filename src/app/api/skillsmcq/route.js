export async function POST(req) {
    const { skill } = await req.json();
  
    if (!skill) {
      return Response.json({ error: "Skill is required" }, { status: 400 });
    }
  
    try {
      const apiKey = process.env.GEMINI_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
      const prompt = `Generate 15 multiple choice questions (MCQs) to assess the skill: "${skill}".
      Dont Give basic questions difficulty should be hard enough to judge a person's skill for job.
  Each question should include:
  - A clear and concise question
  - Four options labeled A, B, C, D
  - The correct answer
  - A short explanation
  
  Return only a valid JSON array with this format:
  [
    {
      "question": "What is ...?",
      "options": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      },
      "correct": "A",
      "explanation": "..."
    }
  ]`;
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });
  
      const data = await response.json();
  
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
      // DEBUG: Log raw Gemini response
      console.log("Gemini raw response:", rawText);
  
      // Extract and parse JSON safely
      const start = rawText.indexOf("[");
      const end = rawText.lastIndexOf("]");
  
      if (start === -1 || end === -1) {
        return Response.json({
          error: "Could not find a JSON array in the response",
          raw: rawText,
        }, { status: 500 });
      }
  
      const jsonString = rawText.slice(start, end + 1);
  
      let questions;
      try {
        questions = JSON.parse(jsonString);
      } catch (jsonError) {
        return Response.json({
          error: "Invalid JSON format from Gemini",
          details: jsonError.message,
          raw: jsonString,
        }, { status: 500 });
      }
  
      return Response.json({ questions }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Failed to generate questions", details: error.message }, { status: 500 });
    }
  }
  