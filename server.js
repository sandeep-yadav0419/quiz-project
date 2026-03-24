const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/quiz.html");
});

app.get("/quiz", async (req, res) => {

    const level = req.query.level || "easy";
    const count = req.query.count || 10;

    const prompt = `
Generate ${count} MCQ questions.

Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "q": "Question?",
      "options": ["A","B","C","D"],
      "answer": 0
    }
  ]
}

Rules:
- No explanation
- No markdown
- Only JSON
- Questions must be different each time
`;

    try {

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.9,

                messages: [
                    {
                        role: "system",
                        content: "You are a quiz generator. Always return valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                // 🔥 MOST IMPORTANT FIX
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        let text = data.choices?.[0]?.message?.content || "";

        console.log("RAW AI:", text);

        let questions = [];

        try {
            const parsed = JSON.parse(text);
            questions = parsed.questions || parsed;
        } catch (e) {
            console.log("JSON ERROR:", text);

            // fallback
            questions = [
                {
                    "q": "Fallback Question 1",
                    "options": ["A", "B", "C", "D"],
                    "answer": 0
                },
                {
                    "q": "Fallback Question 2",
                    "options": ["A", "B", "C", "D"],
                    "answer": 1
                }
            ];
        }

        res.json(questions);

    } catch (err) {
        console.log(err);

        res.json([
            {
                "q": "Server Error",
                "options": ["A", "B", "C", "D"],
                "answer": 0
            }
        ]);
    }
});

app.post("/score", (req, res) => {
    const { name, score } = req.body;
    fs.appendFileSync("leaderboard.txt", `${name} - ${score}\n`);
    res.send("saved");
});

// 🔥 PORT FIX FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
