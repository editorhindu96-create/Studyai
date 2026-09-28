const $ = id => document.getElementById(id);
let chats = JSON.parse(localStorage.getItem("studyAI_chats") || "[]");
let current = [];
let selectedImage = null;

function save(){ localStorage.setItem("studyAI_chats", JSON.stringify(chats)); renderHistory(); }
function renderHistory(){
  $("history").innerHTML = chats.slice(-12).reverse().map((c,i)=>
    `<div class="history-item" data-i="${chats.length-1-i}">${escapeHTML(c.title || "New homework")}</div>`).join("");
  document.querySelectorAll(".history-item").forEach(x=>x.onclick=()=>loadChat(+x.dataset.i));
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function addMessage(role,text){
  $("welcome").classList.add("hidden");
  const wrap=document.createElement("div"); wrap.className=`message ${role}`;
  wrap.innerHTML=`<div><div class="role">${role==="user"?"You":"StudyAI"}</div><div class="bubble">${escapeHTML(text)}</div></div>`;
  $("messages").appendChild(wrap); $("chat").scrollTop=$("chat").scrollHeight;
}
function newChat(){
  current=[]; $("messages").innerHTML=""; $("welcome").classList.remove("hidden"); selectedImage=null;
  $("imagePreview").classList.add("hidden"); $("prompt").value="";
}
function loadChat(i){
  const c=chats[i]; if(!c)return; current=c.messages||[]; $("messages").innerHTML=""; $("welcome").classList.add("hidden");
  current.forEach(m=>addMessage(m.role,m.text));
  $("sidebar").classList.remove("open");
}
function fakeAnswer(q){
  const cls=$("classSelect").value;
  const subject = q.toLowerCase().includes("physics")?"Physics":q.toLowerCase().includes("chem")?"Chemistry":q.toLowerCase().includes("english")?"English":"general";
  return `Here’s a student-friendly way to approach it${cls?` (Class ${cls})`:""}:\n\n1. Read the question carefully and identify what is given.\n2. Write the relevant formula, rule, or concept.\n3. Substitute the given values or apply the rule step by step.\n4. Check the final answer and units.\n\nThis is the website's demo response. To get real AI-generated solutions, connect the secure backend described in README.md.`;
}
async function send(){
  const q=$("prompt").value.trim();
  if(!q && !selectedImage)return;
  const text=q || "Solve this homework question from the uploaded image.";
  addMessage("user",text); current.push({role:"user",text}); $("prompt").value=""; resize();
  $("typing").classList.remove("hidden");
  await new Promise(r=>setTimeout(r,700));
  const answer=fakeAnswer(text);
  $("typing").classList.add("hidden"); addMessage("assistant",answer); current.push({role:"assistant",text:answer});
  chats.push({title:text.slice(0,48),messages:current}); save();
  selectedImage=null; $("imagePreview").classList.add("hidden");
}
function resize(){const t=$("prompt");t.style.height="auto";t.style.height=Math.min(t.scrollHeight,130)+"px"}

$("sendBtn").onclick=send;
$("prompt").addEventListener("input",resize);
$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
$("newChat").onclick=newChat;
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("studyAI_dark",document.body.classList.contains("dark"))};
$("clearBtn").onclick=()=>{if(confirm("Clear saved chats?")){chats=[];save();newChat()}};
if(localStorage.getItem("studyAI_dark")==="true")document.body.classList.add("dark");

$("imageBtn").onclick=()=>$("imageInput").click();
$("imageInput").onchange=e=>{
  const file=e.target.files[0]; if(!file)return;
  selectedImage=file; $("previewImg").src=URL.createObjectURL(file); $("imagePreview").classList.remove("hidden");
};
$("removeImage").onclick=()=>{selectedImage=null;$("imageInput").value="";$("imagePreview").classList.add("hidden")};

document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{$("prompt").value=b.dataset.prompt;resize();$("prompt").focus()});
document.querySelectorAll(".side-btn[data-subject]").forEach(b=>b.onclick=()=>{
  $("prompt").value=`Help me with my ${b.dataset.subject} homework. Explain the answer step by step.`;
  resize(); $("prompt").focus(); $("sidebar").classList.remove("open");
});
renderHistory();
