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

    // 🔥 RANDOM SEED (IMPORTANT)
    const randomSeed = Math.floor(Math.random() * 100000);

const prompt = `
Generate EXACTLY ${count} MCQ questions.

Return ONLY valid JSON array.
Do NOT include any text, explanation, or markdown.

STRICT FORMAT:
[
  {
    "q": "Question?",
    "options": ["A","B","C","D"],
    "answer": 0
  }
]
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

                // 🔥 VERY IMPORTANT FOR RANDOMNESS
                temperature: 0.9,
                top_p: 1,

                messages: [
                    {
                        role: "system",
                        content: "You generate diverse and unique quiz questions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        let text = data.choices?.[0]?.message?.content || "";

        console.log("RAW AI:", text);

        // 🔥 CLEAN OUTPUT
        text = text.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

        let questions;

        try {
            questions = JSON.parse(text);
        } catch (e) {
            console.log("Parse failed", e);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
