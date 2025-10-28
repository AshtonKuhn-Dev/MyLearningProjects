const taskOL = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const taskButton = document.getElementById("addButton");
const clearAllButton = document.getElementById("clearAllButton")
const timerButton = document.getElementById("addTimer")

let tasks = []
let timers = []


function saveTimers(){
  localStorage.setItem("timers",JSON.stringify(timers))
}


function saveTasks(){

  localStorage.setItem("tasks", JSON.stringify(tasks))
  
}

function loadTimers(){
  const savedTimers = localStorage.getItem("timers")
  if(savedTimers){
    timers = JSON.parse(savedTimers)
  }
}

function loadTasks(){
  const savedTasks = localStorage.getItem("tasks")
  if(savedTasks){
    tasks = JSON.parse(savedTasks)
  }
}

function createTimer(timerText, duration, startTime){
  let timerList = document.createElement("li");
  let timeRem = document.createElement("span")

  let timeRemaining;
  
  if(startTime){
    const elapsed = Math.floor((Date.now()-startTime)/1000)
    timeRemaining = duration-elapsed
    if(timeRemaining<0) timeRemaining = 0;
    
  }else{
    timeRemaining = parseInt(duration)
  }

  timeRem.textContent = timeRemaining
  
  let timerName = document.createElement("span")
  timerName.textContent = " " + timerText + " "


  const intervalId = setInterval(() => {
    timeRemaining -= 1;
    timeRem.textContent = timeRemaining
    if(timeRemaining<=0){
      clearInterval(intervalId)
      const sound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg")
      sound.play()
      timerList.remove()
      timers = timers.filter(timers => timers.text != timerText);
      saveTimers();
      
    }
    
  },1000)
  
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click",() => {
    clearInterval(intervalId)
    timerList.remove();
    timers = timers.filter(timers => timers.text != timerText);
    saveTimers();
    });
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click",() => {
    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    editButton.replaceWith(saveButton);
    let newTimerText = document.createElement("input");
    newTimerText.type = "text";
    newTimerText.placeholder = "Enter New Timer Name";
    let newTimerLengthMin = document.createElement("input");
    newTimerLengthMin.type = "text";
    newTimerLengthMin.placeholder = "Enter Min";
    let newTimerLengthSec = document.createElement("input");
    newTimerLengthSec.type = "text";
    newTimerLengthSec.placeholder = "Enter Sec";

    timerList.appendChild(newTimerLengthSec)
    timeRem.replaceWith(newTimerLengthMin);
    timerName.replaceWith(newTimerText);
    
    saveButton.addEventListener("click", ()=> {
      let mins= parseInt(newTimerLengthMin.value)*60
      if (newTimerLengthMin.value === ""){
        return;
      }
      
      let seconds = parseInt(newTimerLengthSec.value)
      if(newTimerLengthSec.value === ""){
        return;
      }
      const totalNewTime = mins+seconds
      const timer = timers.find(timer => timer.text === timerText && timer.duration === duration);
      if(timer){
        timer.text = newTimerText.value;
        timer.duration = totalNewTime;
        timer.startTime = Date.now();
      }
      timerName.textContent = " " + newTimerText.value + " "
      timeRemaining = totalNewTime
      saveTimers();
      newTimerLengthMin.replaceWith(timeRem);
      newTimerText.replaceWith(timerName);
      newTimerLengthSec.remove();
      saveButton.replaceWith(editButton)
      
      
      


      
    });
    
    
    
  });
  timerList.appendChild(timeRem);
  timerList.appendChild(timerName);
  timerList.appendChild(deleteButton);
  timerList.appendChild(editButton)
  
  return timerList;

}
function createElements(taskText, isCompleted){
  let taskList = document.createElement("li");
  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;
  if (isCompleted){
    taskList.classList.add("completed")
  }
  checkBox.addEventListener("change", () => {
    taskList.classList.toggle("completed");
    const task = tasks.find(task => task.text === taskText)
    if(task){
      task.completed = !task.completed
    }
    saveTasks();
  });
  
  let textSpan = document.createElement("span");
  textSpan.textContent = taskText;
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click",() => {
    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    editButton.replaceWith(saveButton);
    let newTaskText = document.createElement("input");
    newTaskText.type = "text";
    newTaskText.placeholder = "Enter New Task";
    textSpan.replaceWith(newTaskText);
    saveButton.addEventListener("click", ()=> {
      
      
      const task = tasks.find(task => task.text === taskText)
      if(task){
        task.text = newTaskText.value;
      }
      taskText = newTaskText.value;
      textSpan.textContent = taskText
      saveTasks();
      newTaskText.replaceWith(textSpan)
    });
  });
  
  
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click",() => {
    taskList.remove()
    tasks = tasks.filter(tasks => tasks.text != taskText)
    saveTasks();
    });


  
  
  taskList.appendChild(checkBox);
  taskList.appendChild(textSpan);
  taskList.appendChild(deleteButton)
  taskList.appendChild(editButton)

 
  return taskList;

  
  
}

taskButton.addEventListener("click" , () => {
  const taskText = taskInput.value
  if(taskText === ""){
    return;
  }
  const taskObject = {
    text:taskText,
    completed:false
  };
  tasks.push(taskObject);
  const taskList = createElements(taskText, false)
  taskOL.appendChild(taskList)

  saveTasks();
  taskInput.value = "";




});

clearAllButton.addEventListener("click", () => {
  while(taskOL.firstChild){
    taskOL.removeChild(taskOL.firstChild)
  }
  tasks = []
  timers = []
  saveTasks()
  saveTimers()
  });
loadTasks();


timerButton.addEventListener("click", () =>{
  const timerInput = document.createElement("input")
  timerInput.type = "text"
  timerInput.placeholder = "Enter Timer Name"
  taskInput.replaceWith(timerInput)
  const timerLengthInputMin = document.createElement("input")
  const timerLengthInputSec = document.createElement("input")
  timerLengthInputSec.type = "text"
  
  timerLengthInputSec.placeholder = "Enter Sec"
  
  timerLengthInputMin.type = "text"
  
  timerLengthInputMin.placeholder = "Enter Min"
  
  document.body.appendChild(timerLengthInputMin)
  document.body.appendChild(timerLengthInputSec)
  
  
  const addTimerButton = document.createElement("button");
  addTimerButton.textContent = "Add"
  timerButton.replaceWith(addTimerButton)
  addTimerButton.addEventListener("click", () => {
    


    
    
   
    const timerText = timerInput.value
    if(timerText === ""){
      return;
    }
    let mins = parseInt(timerLengthInputMin.value)*60

    let seconds = parseInt(timerLengthInputSec.value)
    
    if(timerLengthInputSec.value === ""){
      seconds = 0
    }
    if(timerLengthInputMin.value === ""){
      mins = 0
    }
    if(timerLengthInputMin.value === "" && timerLengthInputSec.value === ""){
      return;
    }
    
     
    const timerLength = mins + seconds
    if(timerLength === ""){
      return;
    }
    const timerObject = {
      text:timerText,
      duration:timerLength,
      startTime:Date.now()
    };
    timers.push(timerObject);
    const timerList = createTimer(timerText, timerLength, Date.now());
    taskOL.appendChild(timerList);
    saveTimers();
    timerLengthInputMin.remove();
    timerLengthInputSec.remove();
    timerInput.replaceWith(taskInput)
    addTimerButton.replaceWith(timerButton)
  });
  
  
  
});

loadTimers();

tasks.forEach(task => {
  const taskList = createElements(task.text, task.completed)
  taskOL.append(taskList)
});

timers.forEach(timer => {
  const timerList = createTimer(timer.text, timer.duration, timer.startTime);
  taskOL.append(timerList)
});