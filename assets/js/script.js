var tasks = []
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector(`#tasks-in-progress`)
var tasksCompletedEl = document.querySelector(`#tasks-completed`)
var pageContentEl = document.querySelector('#page-content')
var taskIdCounter = 0;

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if(!taskNameInput || !taskTypeInput){
        formEl.reset();
        alert("You need to fill out the task form!")
        return false
    }
    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit){
        var taskId = formEl.getAttribute(`data-task-id`)
        completeEditTask(taskNameInput, taskTypeInput, taskId)
    }else{
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do'
        }
        createTaskEl(taskDataObj);
    }
    
};

var taskButtonHandler = function(event){
    var taskId = event.target.getAttribute('data-task-id')

    if (event.target.matches('.delete-btn')){
        deleteTask(taskId)
    } else if (event.target.matches('.edit-btn')){
        editTask(taskId)
    }
}

var completeEditTask = function(taskName, taskType, taskId){
    var selectedTask = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    selectedTask.querySelector(`h3.task-name`).textContent = taskName
    selectedTask.querySelector(`span.task-type`).textContent = taskType
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].name = taskName;
          tasks[i].type = taskType;
        }
    };
    alert(`Task Updated!`)
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
}

var editTask = function (taskId){
    var taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    var taskName = taskSelected.querySelector(`h3.task-name`).textContent
    var taskType = taskSelected.querySelector(`span.task-type`).textContent
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

var deleteTask = function (taskId){
    var taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    taskSelected.remove()
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks.splice(i, 1);
        }
    }
    saveTasks();
}


var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement('div')
    actionContainerEl.setAttribute('class', 'task-actions')

    var editButtonEl = document.createElement('button')
    editButtonEl.setAttribute('class', 'btn edit-btn')
    editButtonEl.setAttribute('data-task-id', taskId)
    editButtonEl.textContent= 'Edit'
    actionContainerEl.appendChild(editButtonEl)

    var deleteButtonEl = document.createElement('button')
    deleteButtonEl.textContent = 'Delete'
    deleteButtonEl.setAttribute('data-task-id', taskId)
    deleteButtonEl.setAttribute('class', 'btn delete-btn')
    actionContainerEl.appendChild(deleteButtonEl)

    var statusSelectEl = document.createElement('select')
    statusSelectEl.className = 'select-status'
    statusSelectEl.setAttribute('name', 'status-change')
    statusSelectEl.setAttribute('data-task-id', taskId)
    actionContainerEl.appendChild(statusSelectEl)

    var statusChoices = ['To Do', 'In Progress', 'Completed']
    for (let i=0; i<statusChoices.length;i++){
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl
}

var taskStatusChangeHandler = function(event){
    var taskId = event.target.getAttribute('data-task-id')
    var statusValue = event.target.value.toLowerCase()
    var taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    if(statusValue === 'to do'){
        tasksToDoEl.appendChild(taskSelected)
    } else if (statusValue === 'in progress'){
        tasksInProgressEl.appendChild(taskSelected)
    } else if (statusValue === 'completed'){
        tasksCompletedEl.appendChild(taskSelected)
    }
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute('data-task-id')
    event.dataTransfer.setData('text/plain', taskId)
}

var dropZoneDragHandler = function(event){
    var taskListEl = event.target.closest('.task-list')
    if (taskListEl){
        event.preventDefault()
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
        // console.dir(taskListEl)
    }
}

var dropTaskHandler = function(event){
    var id = event.dataTransfer.getData("text/plain");

    var draggableElement = document.querySelector("[data-task-id='" + id + "']");

    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    } 
    else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
    } 
    else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);


    // if (event.target.matches('#tasks-to-do')){
    //     tasksToDoEl.appendChild(document.querySelector(`.task-item[data-task-id='${id}']`))
    // } else if (event.target.matches('#tasks-in-progress')){
    //     tasksInProgressEl.appendChild(document.querySelector(`.task-item[data-task-id='${id}']`))
    // } else if (event.target.matches('#tasks-completed')){
    //     tasksCompletedEl.appendChild(document.querySelector(`.task-item[data-task-id='${id}']`))
    // }
    saveTasks();
}

var dragLeaveHandler = function(event){
    var taskListEl = event.target.closest('.task-list')
    if (taskListEl){ 
        taskListEl.removeAttribute("style");
    }
}

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute('draggable', 'true')
    taskDataObj['id'] = taskIdCounter
  
    // add task id as a custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter)

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
  
    listItemEl.appendChild(createTaskActions(taskIdCounter))

    tasksToDoEl.appendChild(listItemEl);

    tasks.push(taskDataObj)
    // increase task counter for next unique id
    taskIdCounter++

    saveTasks();
};

var saveTasks = function(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

var loadTasks = function(){
    savedTasks = localStorage.getItem('tasks')
    if(!savedTasks){
        return false
    }
    savedTasks = JSON.parse(savedTasks)
    for(let i=0;i<savedTasks.length;i++){
        createTaskEl(savedTasks[i])
    }
}

pageContentEl.addEventListener('change', taskStatusChangeHandler)

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener('click', taskButtonHandler)

pageContentEl.addEventListener('dragstart', dragTaskHandler)

pageContentEl.addEventListener('dragover', dropZoneDragHandler)

pageContentEl.addEventListener('drop', dropTaskHandler)

pageContentEl.addEventListener('dragleave', dragLeaveHandler)

loadTasks();