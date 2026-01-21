const grid=document.getElementById("taskGrid")
const taskInput=document.getElementById("taskInput")
const addTask=document.getElementById("addTask")
const completedCount=document.getElementById("completedCount")
const goalCount=document.getElementById("goalCount")
const focusBar=document.getElementById("focusBar")
const goalType=document.getElementById("goalType")

const modal=document.getElementById("modal")
const modalTitle=document.getElementById("modalTitle")
const modalGoal=document.getElementById("modalGoal")
const modalStage=document.getElementById("modalStage")
const advanceBtn=document.getElementById("advanceBtn")
const deleteBtn=document.getElementById("deleteBtn")

let tasks=JSON.parse(localStorage.getItem("decisionGarden"))||[]
let active=null
const page=document.body.className

addTask?.addEventListener("click",()=>{
if(!taskInput.value.trim())return
tasks.push({id:Date.now(),text:taskInput.value,goal:goalType.value,stage:"seed",img:img()})
save();taskInput.value="";render()
})

function render(){
if(!grid)return
grid.innerHTML=""
tasks.filter(f).forEach(t=>{
const d=document.createElement("div")
d.className="card"
d.style.backgroundImage=`url(${t.img})`
d.innerHTML=`<h3>${emoji(t.stage)} ${t.text}</h3>`
d.onclick=()=>open(t.id)
grid.appendChild(d)
})
updateStats()
}

function f(t){
if(page==="projects")return t.goal==="long"
if(page==="neglected")return t.stage==="wilt"
return true
}

function open(id){
active=tasks.find(t=>t.id===id)
modal.style.display="flex"
modalTitle.textContent=active.text
modalGoal.textContent=active.goal
modalStage.textContent=active.stage
}

function closeModal(){modal.style.display="none";active=null}

advanceBtn?.addEventListener("click",()=>{
if(!active)return
active.stage=active.stage==="seed"?"sprout":"bloom"
save();closeModal();render()
})

deleteBtn?.addEventListener("click",()=>{
tasks=tasks.filter(t=>t.id!==active.id)
save();closeModal();render()
})

function updateStats(){
if(!completedCount)return
const done=tasks.filter(t=>t.stage==="bloom").length
completedCount.textContent=done
goalCount.textContent=tasks.length
focusBar.style.width=tasks.length?done/tasks.length*100+"%":"0%"
}

function emoji(s){return s==="seed"?"🌱":s==="sprout"?"🌿":s==="bloom"?"🌸":"🍂"}
function img(){
const a=[
"https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
"https://images.unsplash.com/photo-1469474968028-56623f02e42e"
]
return a[Math.floor(Math.random()*a.length)]
}
function save(){localStorage.setItem("decisionGarden",JSON.stringify(tasks))}
render()
