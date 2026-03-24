const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/quiz.html");
});

// ✅ C LANGUAGE QUIZ
app.get("/quiz", (req, res) => {

    const level = req.query.level || "easy";

    let questions = [];

    // 🟢 EASY
    if (level === "easy") {
        questions = [
            {
                q: "Who is the father of C language?",
                options: ["Dennis Ritchie", "James Gosling", "Bjarne Stroustrup", "Guido van Rossum"],
                answer: 0
            },
            {
                q: "Which symbol is used for comments in C?",
                options: ["//", "#", "<!-- -->", "**"],
                answer: 0
            },
            {
                q: "Which header file is used for printf?",
                options: ["stdio.h", "conio.h", "math.h", "stdlib.h"],
                answer: 0
            },
            {
                q: "C language is?",
                options: ["High level", "Low level", "Both", "None"],
                answer: 2
            },
            {
                q: "Which keyword is used to define a constant?",
                options: ["const", "var", "let", "static"],
                answer: 0
            }
        ];
    }

    // 🟡 MEDIUM
    else if (level === "medium") {
        questions = [
            {
                q: "What is the size of int in C?",
                options: ["2 bytes", "4 bytes", "Depends on compiler", "8 bytes"],
                answer: 2
            },
            {
                q: "Which operator is used to access value at address?",
                options: ["*", "&", "%", "#"],
                answer: 0
            },
            {
                q: "Which loop is guaranteed to execute at least once?",
                options: ["for", "while", "do-while", "none"],
                answer: 2
            },
            {
                q: "Which function is used to allocate memory?",
                options: ["malloc()", "alloc()", "new()", "create()"],
                answer: 0
            },
            {
                q: "Which keyword is used to exit a loop?",
                options: ["stop", "break", "exit", "end"],
                answer: 1
            }
        ];
    }

    // 🔴 HARD
    else if (level === "hard") {
        questions = [
            {
                q: "What is dangling pointer?",
                options: ["Pointer not initialized", "Pointer pointing to freed memory", "Null pointer", "None"],
                answer: 1
            },
            {
                q: "Which storage class has maximum scope?",
                options: ["auto", "register", "static", "extern"],
                answer: 3
            },
            {
                q: "What will sizeof(char) return?",
                options: ["1", "2", "4", "Depends"],
                answer: 0
            },
            {
                q: "Which function is used to free memory?",
                options: ["delete()", "remove()", "free()", "clear()"],
                answer: 2
            },
            {
                q: "What is recursion?",
                options: ["Loop", "Function calling itself", "Pointer", "Array"],
                answer: 1
            }
        ];
    }

    res.json(questions);
});

// leaderboard
app.post("/score", (req, res) => {
    const { name, score } = req.body;
    fs.appendFileSync("leaderboard.txt", `${name} - ${score}\n`);
    res.send("saved");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
