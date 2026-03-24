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

    try {

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
                    content:`Give ONLY JSON array (no text)

[
{"q":"Question","options":["A","B","C","D"],"answer":1}
]

Topic: C Programming`
                }]
            })
        });

        const data = await response.json();

        let text = data.choices?.[0]?.message?.content || "";

        // 🔥 CLEAN AI OUTPUT
        text = text.replace(/```json/g,"").replace(/```/g,"").trim();

        let questions;

        try {
            questions = JSON.parse(text);
        } catch {
            console.log("Parse error:", text);
            questions = [
                {"q":"Fallback: Father of C?","options":["Dennis","Ken","James","Bjarne"],"answer":1}
            ];
        }

        res.json(questions);

    } catch(err){
        console.log(err);
        res.json([
            {"q":"Server Error","options":["A","B","C","D"],"answer":1}
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
