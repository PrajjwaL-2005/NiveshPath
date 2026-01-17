import axios from "axios";

export const chatWithStockAI = async (req, res) => {
  try {
    const { symbol, question, stockData } = req.body;

    if (!symbol || !question) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const prompt = `
Stock Symbol: ${symbol}

Stock Data:
${JSON.stringify(stockData, null, 2)}

User Question:
${question}

Explain in simple beginner-friendly language.
Avoid financial advice.
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        system_instruction: {
          parts: [
            {
              text: "You are a stock market assistant for beginners."
            }
          ]
        },
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 1.0
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I could not generate a response.";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI service failed" });
  }
};
