require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/quiz.html");
});

let scores = [];

// 🤖 AI Quiz
app.get("/quiz", async (req, res) => {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${process.env.API_KEY}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            model:"gpt-4o-mini",
            messages:[{
                role:"user",
                content:`Generate 5 MCQ questions in JSON only format like:
[
{"q":"question","options":["a","b","c"],"answer":1}
]`
            }]
        })
    });

    const data = await response.json();

    let text = data.choices[0].message.content;

    try {
        let json = JSON.parse(text);
        res.json(json);
    } catch {
        res.json([
            {"q":"Fallback: Father of C?","options":["Dennis","Ken","James"],"answer":1}
        ]);
    }
});

// 💾 Save Score
app.post("/score",(req,res)=>{
    scores.push(req.body);
    res.json({msg:"saved"});
});

// 🏆 Leaderboard
app.get("/leaderboard",(req,res)=>{
    scores.sort((a,b)=>b.score-a.score);
    res.json(scores);
});

app.listen(3000,()=>console.log("Server running 🚀"));
