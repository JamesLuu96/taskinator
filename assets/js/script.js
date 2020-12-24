// Global Variables
var buttonE1 = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector('#tasks-to-do')

var createTaskHandler = function(){
    var newItem = document.createElement('li')
    newItem.textContent = 'This is a new task'
    newItem.setAttribute('class', 'task-item')
    tasksToDoEl.appendChild(newItem)
}

buttonE1.addEventListener("click", createTaskHandler)