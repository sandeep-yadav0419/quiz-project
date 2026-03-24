app.get("/quiz", (req, res) => {
    const level = req.query.level || "easy";

    function shuffle(question) {
        const correct = question.options[question.answer];
        let shuffled = [...question.options].sort(() => Math.random() - 0.5);

        return {
            q: question.q,
            options: shuffled,
            answer: shuffled.indexOf(correct)
        };
    }

    const questions = {
        easy: [
            {q:"Father of C?",options:["Dennis Ritchie","James","Bjarne","Guido"],answer:0},
            {q:"Header for printf?",options:["stdio.h","math.h","conio.h","stdlib.h"],answer:0},
            {q:"C is?",options:["High","Low","Both","None"],answer:2},
            {q:"Comments?",options:["//","##","**","<>"],answer:0},
            {q:"Keyword for constant?",options:["const","var","let","static"],answer:0},
            {q:"Extension?",options:[".c",".cpp",".py",".java"],answer:0},
            {q:"Loop keyword?",options:["for","loop","repeat","none"],answer:0},
            {q:"Return keyword?",options:["return","give","send","back"],answer:0},
            {q:"Main function?",options:["main()","start()","run()","init()"],answer:0},
            {q:"C is compiled?",options:["Yes","No","Maybe","None"],answer:0}
        ],

        medium: [
            {q:"Size of int?",options:["2","4","Depends","8"],answer:2},
            {q:"Pointer symbol?",options:["*","&","%","#"],answer:0},
            {q:"Loop once?",options:["for","while","do-while","none"],answer:2},
            {q:"malloc returns?",options:["int","pointer","char","void"],answer:1},
            {q:"Free memory?",options:["free()","delete()","remove()","clear()"],answer:0},
            {q:"Break use?",options:["exit loop","start","repeat","none"],answer:0},
            {q:"Array index start?",options:["0","1","-1","none"],answer:0},
            {q:"%d is?",options:["int","char","float","string"],answer:0},
            {q:"Function?",options:["block","loop","array","none"],answer:0},
            {q:"Recursion?",options:["self call","loop","array","none"],answer:0}
        ],

        hard: [
            {q:"Dangling pointer?",options:["freed memory","null","valid","none"],answer:0},
            {q:"sizeof(char)?",options:["1","2","4","depends"],answer:0},
            {q:"Extern keyword?",options:["global","local","private","none"],answer:0},
            {q:"Static lifetime?",options:["whole program","block","loop","none"],answer:0},
            {q:"Heap memory?",options:["dynamic","stack","static","none"],answer:0},
            {q:"Stack used for?",options:["function call","heap","array","none"],answer:0},
            {q:"Pointer to pointer?",options:["**","*","&","none"],answer:0},
            {q:"Seg fault?",options:["memory error","syntax","logic","none"],answer:0},
            {q:"Volatile keyword?",options:["no optimization","loop","array","none"],answer:0},
            {q:"Enum?",options:["user type","loop","array","none"],answer:0}
        ]
    };

    // 🔥 SHUFFLE + RANDOMIZE QUESTION ORDER ALSO
    let finalQuestions = questions[level]
        .sort(() => Math.random() - 0.5)   // question order random
        .map(q => shuffle(q));             // options random

    res.json(finalQuestions);
});
