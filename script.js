"use strict";
const inputEl = document.querySelector(".task-name");
//variables
let datas = [];
let tabselected = "";

//create a task element 
function createTaskEl(data) {
  /*<div class="task" id="9486789">
      <input type="checkbox" onclick="handleCheckClick(event)">
      <p contenteditable="true" onkeydown="handleEdit(event)">TODO NOTES 1</p>
      <button class="close" onclick="handleDeleteClick(event)">
        delete
      </button>
  </div> */
  //parent element 
  let task = document.createElement("div");
  task.setAttribute("id", data.id);
  task.classList.add("task");
  task.setAttribute("draggable", "true");
  task.setAttribute("ondragstart", "onDragStart(event);");
  task.setAttribute("ondragend", "onDragEnd(event);");
  //child elements --> checkbox element
  let checkEl = document.createElement("input");
  checkEl.type = "checkbox";
  checkEl.setAttribute("onclick", "handleCheckClick(event)");
  if (data.status === "completed") {
    checkEl.setAttribute("checked", true);
  }
  //child elements --> input p element
  let inputEl = document.createElement("p");
  inputEl.textContent = data.task;
  inputEl.setAttribute("contenteditable", "true");
  inputEl.setAttribute("onkeydown", "handleEdit(event)")
  //child elements --> close btn element 
  let closeBtn = document.createElement("button");
  closeBtn.classList.add('close');
  closeBtn.textContent = "delete";
  closeBtn.setAttribute("onclick", "handleDeleteClick(event)")
  //appending all child element to parent elements 
  task.appendChild(checkEl);
  task.appendChild(inputEl);
  task.appendChild(closeBtn);
  return task;
}

function newid() {
  return `${Math.floor(Math.random() * 10000000)}`
}

//handle Submit click
function handleSubmitClick(event) {
  event.preventDefault();
  let newtaskdata;
  const input = event.currentTarget.querySelector('.task-name');
  if (input.value.trim() !== "") {
    newtaskdata = {
      id: newid(),
      task: input.value,
      taskstatus: 'pending',
    };
    input.value = "";
    //create taskEl using createTaskEl function
    const newTaskEL = createTaskEl(newtaskdata);
    const pendingContainer = document.getElementById("pending");
    pendingContainer.appendChild(newTaskEL);
    datas.push(newtaskdata);
    console.log(datas);
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks",JSON.stringify(datas));
    displayTaskNumbers();
  } else {
    alert("cannot enter empty task!");
  }
  // Save tasks to local storage
  // localStorage.setItem('tasks', JSON.stringify(datas));
}

init();
//checkbox click handling function
function handleCheckClick(event) {
  console.log(event.target.parentElement.id);
  let tempTaskStatus = "";
  if (event.currentTarget.checked) {
    const completedContainer = document.getElementById("completed");
    tempTaskStatus = "completed";
    completedContainer.appendChild(event.currentTarget.parentElement);
  } else {
    const pendingContainer = document.getElementById("pending");
    tempTaskStatus = "pending";
    pendingContainer.appendChild(event.currentTarget.parentElement);
  }
  datas.forEach(data => {
    if(data.id  === event.target.parentElement.id){
      data.status=tempTaskStatus;
    }
  })
  localStorage.setItem("tasks", JSON.stringify(datas));
  displayTaskNumbers();
}

//delete task function
function handleDeleteClick(event) {
  const taskId = event.currentTarget.parentElement.getAttribute("id");
  const parent = event.currentTarget.parentElement.parentElement;
  parent.removeChild(event.currentTarget.parentElement)
  datas.forEach((data, index) =>{
    if(data.id === taskId) {
      datas.splice(index,1);
    }
  });
  displayTaskNumbers();
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(datas));
}

//function to give tab feature
function handleTabSwitch(event) {
  // Remove the "selected" class from all tab buttons
  const tabButtons = document.querySelectorAll(".tab");
  tabButtons.forEach(button => {
    button.classList.remove("selected");
  });

  // Add the "selected" class to the clicked tab button
  event.target.classList.add("selected");

  // Get the value of the selected tab
  const selectedTab = event.target.getAttribute("data-tab");

  // Show/hide tasks based on the selected tab
  const pendingTasks = document.querySelector(".row.pending");
  const completedTasks = document.querySelector(".row.completed");
  const pendingCont = document.querySelector("#pending");
  const completedCont = document.querySelector("#completed");
  const mainContainer = document.querySelector(".container")

  if (selectedTab === "all") {
    pendingTasks.style.display = "block";
    completedTasks.style.display = "block";
    mainContainer.classList.remove("tabMax");
    pendingCont.style.minHeight = "230px"
    completedCont.style.minHeight = "230px"
  }
  else if (selectedTab === "pending") {
    pendingTasks.style.display = "block";
    completedTasks.style.display = "none";
    pendingCont.style.minHeight = "95%"
    mainContainer.classList.add("tabMax");
  }
  else if (selectedTab === "completed") {
    pendingTasks.style.display = "none";
    completedTasks.style.display = "block";
    completedCont.style.minHeight = "95%"
    mainContainer.classList.add("tabMax");
  }
}

// function to update taskstatus 
function updateTaskStatus(status,id) {
  datas.forEach(item => {
    if (item.id === id) {
      item.taskstatus = status;
    }
  })
  localStorage.setItem("tasks", JSON.stringify(datas));
}

function displayTaskNumbers() {
  const conatainers = document.querySelectorAll(".row");
  conatainers.forEach(container => {
    const totaltask = container.querySelectorAll(".tasks .task").length;
    const taskno = container.querySelector(".tasks-no");
    taskno.textContent = `${totaltask}`;
  })
}

function init() {
  const storedData = localStorage.getItem("tasks")
  const backData = storedData ? JSON.parse(storedData): [];
  if (backData && backData.length > 0) {
    tabSetter(backData);
  }
  datas = backData;
  displayTaskNumbers();
}

function tabSetter(backData) {
  if (backData && backData.length > 0) {
    backData.forEach(data => {
      const parent = document.getElementById(`${data.status}`);
      parent.appendChild(createTaskEl(data));
    });
  }
}

function handleEdit(event) {
  const editedTask = event.currentTarget.textContent;
  const currId = event.currentTarget.parentElement.id;
  if (event.key === "Enter") {
    event.preventDefault();
    datas.forEach(item => {
      if (currId === item.id) {
        item.task = editedTask;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(datas));
  }
}


//drag and drop
function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.id);
  event.currentTarget.style.opacity = "0.6";
}
function onDragEnd(event) {
  event.currentTarget.style.opacity = "1";
}
function onDragOver(event) {
  event.preventDefault();
}
function onDrop(event) {
  const id= event.dataTransfer.getData("text");
  const draggedEl = document.getElementById(id);
  const container = event.currentTarget;
  const newStatus = event.currentTarget.getAttribute("id");
  //updating the status of element dropped
  updateTaskStatus(newStatus,id);
  if (newStatus !== "completed") {
    draggedEl.querySelector("input").checked = false;
  } else {
    draggedEl.querySelector("input").checked = true;
  }
  const allTask = container.querySelectorAll(".task");
  const dropElY = event.y;
  if (allTask.length >= 1) {
    for (let i = 0; i < allTask.length; i++) {
      const allTaskY1 =
        allTask[i].getBoundingClientRect().y +
        allTask[i].getBoundingClientRect().height / 2;
      const allTaskY2 =
        allTask[i].getBoundingClientRect().y +
        allTask[i].getBoundingClientRect().height;
      //check dropping element y(height) smaller than allTask1 (insert Above)
      if (dropElY <= allTaskY1) {
        allTask[i].parentNode.insertBefore(draggedEl, allTask[i]);
        break;
      }
      if (dropElY <= allTaskY2) {
        allTask[i].parentNode.insertBefore(draggedEl, allTask[i].nextSibling);
        break;
      };
      container.appendChild(draggedEl);
    }
  }
  else {
    container.appendChild(draggedEl);
  }
  displayTaskNumbers();
}