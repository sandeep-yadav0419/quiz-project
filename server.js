const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/quiz.html");
});

app.get("/quiz", async (req, res) => {

    const count = req.query.count || 5;

    const prompt = `
Generate ${count} MCQ questions.

Return ONLY JSON:

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
                temperature: 0.9,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        let text = data.choices?.[0]?.message?.content || "";

        console.log("RAW:", text);

        // ✅ CLEAN JSON
        text = text.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

        let questions;

        try {
            questions = JSON.parse(text);
        } catch (e) {
            console.log("JSON ERROR:", text);

            questions = [
                {
                    q: "Fallback Question",
                    options: ["A", "B", "C", "D"],
                    answer: 0
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
