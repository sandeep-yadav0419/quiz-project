const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/quiz.html");
});

app.get("/quiz", async (req,res)=>{

    const level = req.query.level || "easy";

    const prompt = `Generate 10 MCQ questions (JSON only)
Difficulty: ${level}

Format:
[
{"q":"Question","options":["A","B","C","D"],"answer":1}
]`;

    try{

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${process.env.API_KEY}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            model:"gpt-4o-mini",
            messages:[{role:"user",content:prompt}]
        })
    });

    const data = await response.json();
    let text = data.choices[0].message.content;

    text = text.replace(/```json/g,"").replace(/```/g,"").trim();

    let questions;

    try{
        questions = JSON.parse(text);
    }catch{
        questions = [
            {"q":"Fallback: Father of C?","options":["Dennis","Ken","James","Bjarne"],"answer":1}
        ];
    }

    res.json(questions);

    }catch{
        res.json([
            {"q":"Server error","options":["A","B","C","D"],"answer":1}
        ]);
    }
});

app.post("/score",(req,res)=>{
    const {name,score} = req.body;
    fs.appendFileSync("leaderboard.txt",`${name} - ${score}\n`);
    res.send("saved");
});

app.listen(3000,()=>console.log("Server running 🚀"));
