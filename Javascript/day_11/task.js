let tasks = [];
let priorities = [];

function addTask() {
    const taskInput = document.getElementById('task');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('taskList');

    let task = taskInput.value.trim();
    let priority = Number(priorityInput.value.trim());

    if (task !== '' && !isNaN(priority) && priority >= 1 && priority <= 3) {

        tasks.push(task);
        priorities.push(priority);

        const li = document.createElement('li');

        // Add a span to store task text
        const taskSpan = document.createElement('span');
        taskSpan.textContent = task;
        li.appendChild(taskSpan);

        // Priority style
        switch (priority) {
            case 1:
                li.classList.add('priority', 'high');
                break;
            case 2:
                li.classList.add('priority', 'medium');
                break;
            case 3:
                li.classList.add('priority', 'low');
                break;
        }

        // Complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete Task';
        completeButton.onclick = () => {
            li.classList.toggle('completed');
        };
        li.appendChild(completeButton);

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Task';
        editButton.onclick = () => {
            let newTask = prompt('Edit Task:', task);
            if (newTask && newTask.trim() !== '') {
                let index = tasks.indexOf(task);
                tasks[index] = newTask;
                taskSpan.textContent = newTask;
                task = newTask;
            }
        };
        li.appendChild(editButton);

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Task';
        removeButton.onclick = () => {
            let index = tasks.indexOf(task);
            tasks.splice(index, 1);
            priorities.splice(index, 1);
            taskList.removeChild(li);
        };
        li.appendChild(removeButton);

        taskList.appendChild(li);

        taskInput.value = '';
        priorityInput.value = '';

    } else {
        alert('Please enter a valid priority between 1 and 3');
    }
}
