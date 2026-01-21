const taskInput=document.getElementById("taskInput")
const addTaskBtn=document.getElementById("addTask")
const taskGrid=document.getElementById("taskGrid")
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
let activeTask=null

addTaskBtn.onclick=()=>{
if(!taskInput.value.trim())return
tasks.push({
id:Date.now(),
text:taskInput.value,
goal:goalType.value,
stage:"seed",
image:randomImage()
})
save()
taskInput.value=""
render()
}

function render(){
taskGrid.innerHTML=""
tasks.forEach(t=>{
const card=document.createElement("div")
card.className=`card ${t.stage}`
card.style.backgroundImage=`url(${t.image})`
card.innerHTML=`<h3>${emoji(t.stage)} ${t.text}</h3><p>${t.goal==="daily"?"🎯 Daily Goal":"🌳 Long-Term Goal"}</p>`
card.onclick=()=>openModal(t.id)
taskGrid.appendChild(card)
})
updateStats()
}

function openModal(id){
activeTask=tasks.find(t=>t.id===id)
modal.style.display="flex"
modalTitle.textContent=activeTask.text
modalGoal.textContent=activeTask.goal
modalStage.textContent="Stage: "+activeTask.stage
}

function closeModal(){
modal.style.display="none"
activeTask=null
}

advanceBtn.onclick=()=>{
if(!activeTask)return
activeTask.stage=nextStage(activeTask.stage)
save()
closeModal()
render()
}

deleteBtn.onclick=()=>{
tasks=tasks.filter(t=>t.id!==activeTask.id)
save()
closeModal()
render()
}

function nextStage(s){
if(s==="seed")return"sprout"
if(s==="sprout")return"bloom"
return"bloom"
}

function updateStats(){
const completed=tasks.filter(t=>t.stage==="bloom").length
completedCount.textContent=completed
goalCount.textContent=tasks.length
focusBar.style.width=tasks.length?completed/tasks.length*100+"%":"0%"
}

function emoji(s){
return s==="seed"?"🌱":s==="sprout"?"🌿":s==="bloom"?"🌸":"🍂"
}

function randomImage(){
const imgs=[
"https://images.unsplash.com/photo-1469474968028-56623f02e42e",
"https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
"https://images.unsplash.com/photo-1492496913980-501348b61469",
"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
]
return imgs[Math.floor(Math.random()*imgs.length)]
}

function save(){
localStorage.setItem("decisionGarden",JSON.stringify(tasks))
}

render()
