// Elementos HTML
const counterTotal = document.getElementById('counter-total');
const counterCompleted = document.getElementById('counter-completed');
const taskList = document.getElementById('to-do-list');
const form = document.getElementById('create-to-do-form');

// LocalStorage functions
const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];
const setTasksInLocalStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

// Atualizar contadores
const updateCounters = () => {
    const tasks = getTasksFromLocalStorage();
    counterTotal.textContent = tasks.length;
    counterCompleted.textContent = tasks.filter(task => task.checked).length;
};

// Criar elemento de tarefa
const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.id = task.id;
    if (task.checked) li.classList.add('completed');

    // Conteúdo principal
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Descrição
    const description = document.createElement('span');
    description.textContent = task.description;
    taskContent.appendChild(description);

    // Meta dados
    const metaContainer = document.createElement('div');
    metaContainer.className = 'task-meta-container';

    if (task.label) {
        const label = document.createElement('span');
        label.className = 'task-label';
        label.textContent = task.label;
        metaContainer.appendChild(label);
    }

    const date = document.createElement('small');
    date.className = 'task-date';
    date.textContent = `Criado em: ${new Date(task.createdAt).toLocaleDateString('pt-BR')}`;
    metaContainer.appendChild(date);

    taskContent.appendChild(metaContainer);

    // Botão de conclusão
    const button = document.createElement('button');
    button.className = `remove-task-btn ${task.checked ? 'checked' : ''}`;
    button.textContent = task.checked ? '✔' : 'Concluir';
    button.onclick = () => toggleTaskCompletion(task.id);

    li.appendChild(taskContent);
    li.appendChild(button);
    taskList.appendChild(li);

    return li;
};

// Alternar estado da tarefa
const toggleTaskCompletion = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => 
        task.id === taskId ? {...task, checked: !task.checked} : task
    );
    setTasksInLocalStorage(updatedTasks);
    updateDOM();
};

// Atualizar interface
const updateDOM = () => {
    taskList.innerHTML = '';
    getTasksFromLocalStorage().forEach(task => createTaskElement(task));
    updateCounters();
};

// Criar nova tarefa
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = e.target.elements.description.value.trim();
    const label = e.target.elements.label.value.trim();
    if (!description) return;

    const newTask = {
        id: String(Date.now()),
        description,
        label,
        checked: false,
        createdAt: Date.now()
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(newTask);
    setTasksInLocalStorage(tasks);
    updateDOM();
    e.target.reset();
});

// Inicialização
window.addEventListener('DOMContentLoaded', updateDOM);