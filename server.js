const express = require("express");
const fs = require("fs");

// ✅ fetch fix (important for Node)
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/quiz.html");
});

app.get("/quiz", async (req, res) => {

    const level = req.query.level || "easy";
    const count = req.query.count || 5;

    const prompt = `
Generate ${count} multiple choice questions.

Return ONLY JSON like this:

[
  {
    "q": "Question?",
    "options": ["A","B","C","D"],
    "answer": 0
  }
]

Rules:
- No explanation
- No text before or after
- Only JSON
- Make questions unique
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
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("RESPONSE:", JSON.stringify(data, null, 2));

        let text = data.choices?.[0]?.message?.content || "";

        console.log("RAW TEXT:", text);

        let questions;

        try {
            questions = JSON.parse(text);
        } catch (e) {
            console.log("JSON ERROR");

            questions = [
                {
                    q: "Fallback Question 1",
                    options: ["A", "B", "C", "D"],
                    answer: 0
                },
                {
                    q: "Fallback Question 2",
                    options: ["A", "B", "C", "D"],
                    answer: 1
                }
            ];
        }

        res.json(questions);

    } catch (err) {
        console.log("ERROR:", err);

        res.json([
            {
                q: "Server Error",
                options: ["A", "B", "C", "D"],
                answer: 0
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
