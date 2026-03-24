<!DOCTYPE html>
<html>
<head>
<title>AI Quiz</title>
<style>
body{background:#0f172a;color:white;text-align:center;font-family:Arial;}
button{padding:10px;margin:5px;border:none;border-radius:8px;}
.option{display:block;margin:10px auto;width:200px;background:#1e293b;color:white;}
.correct{background:green;}
.wrong{background:red;}
#chatbox{position:fixed;bottom:10px;right:10px;width:280px;height:350px;background:#1e293b;border-radius:10px;display:flex;flex-direction:column;}
#chatMessages{flex:1;overflow:auto;padding:10px;text-align:left;}
.msg{padding:8px;margin:5px;border-radius:8px;max-width:80%;}
.user{background:#3b82f6;align-self:flex-end;}
.bot{background:#374151;}
</style>
</head>
<body>

<h1>🎮 AI Quiz</h1>

<input id="name" placeholder="Enter name">
<br><br>

<select id="level">
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>
</select>

<button onclick="startQuiz()">Start 🚀</button>

<div id="timer">⏳ 10</div>
<div style="width:200px;background:#333;margin:auto;">
<div id="bar" style="height:10px;background:lime;width:100%"></div>
</div>

<h2 id="question"></h2>
<div id="options"></div>
<h3 id="score"></h3>

<button onclick="loadLeaderboard()">Leaderboard 🏆</button>
<pre id="leaderboard"></pre>

<!-- SOUND -->
<audio id="correctSound" src="https://www.soundjay.com/buttons/sounds/button-3.mp3"></audio>
<audio id="wrongSound" src="https://www.soundjay.com/buttons/sounds/button-10.mp3"></audio>

<!-- CHAT -->
<div id="chatbox">
<div id="chatMessages"></div>
<input id="chatInput">
<button onclick="sendChat()">Send</button>
</div>

<script>
let q=[],i=0,s=0,time=10,timer;

async function startQuiz(){
let level=document.getElementById("level").value;
let res=await fetch(`/quiz?level=${level}`);
q=await res.json();
i=0;s=0;
loadQ();
}

function loadQ(){
if(i>=q.length){showScore();return;}
time=10;startTimer();
document.getElementById("question").innerText=q[i].q;
let op=document.getElementById("options");op.innerHTML="";
q[i].options.forEach((o,idx)=>{
let b=document.createElement("button");
b.innerText=o;b.className="option";
b.onclick=()=>check(idx,b);
op.appendChild(b);
});
}

function check(idx,b){
clearInterval(timer);
if(idx===q[i].answer){
b.classList.add("correct");
document.getElementById("correctSound").play();
s++;
}else{
b.classList.add("wrong");
document.getElementById("wrongSound").play();
}
setTimeout(()=>{i++;loadQ();},800);
}

function startTimer(){
timer=setInterval(()=>{
time--;
document.getElementById("timer").innerText="⏳ "+time;
document.getElementById("bar").style.width=(time*10)+"%";
if(time<=0){clearInterval(timer);i++;loadQ();}
},1000);
}

function showScore(){
let name=document.getElementById("name").value||"Guest";
fetch("/score",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,score:s})});
document.getElementById("score").innerText="Score: "+s;
}

async function loadLeaderboard(){
let res=await fetch("/leaderboard");
let data=await res.text();
document.getElementById("leaderboard").innerText=data;
}

// CHATBOT
function sendChat(){
let msg=document.getElementById("chatInput").value;
add(msg,"user");
typing();

setTimeout(()=>{
let r=reply(msg.toLowerCase());
add(r,"bot");
speak(r);
},1000);
}

function add(text,type){
let d=document.createElement("div");
d.className="msg "+type;
d.innerText=text;
document.getElementById("chatMessages").appendChild(d);
}

function typing(){add("typing...","bot");}

function reply(m){
if(m.includes("hi")) return "Hello 😄";
if(m.includes("c")) return "C is programming language 💻";
if(m.includes("loop")) return "Loop repeats 🔁";
return "Interesting 🤔";
}

function speak(t){
let s=new SpeechSynthesisUtterance(t);
speechSynthesis.speak(s);
}
</script>

</body>
</html>
