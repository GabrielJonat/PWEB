const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');
var coluna_a_fazer = document.getElementById('a-fazer');

function kanban(element) {
    element.classList.add('kanbanColor');
}
function kanbanRemove(element) {
    element.classList.remove('kanbanColor');
}
function alunos(element) {
    element.classList.add('alunosColor');
}
function alunosRemove(element) {
    element.classList.remove('alunosColor');
}
function estudos(element) {
    element.classList.add('estudosColor');
}
function estudosRemove(element) {
    element.classList.remove('estudosColor');
}

// Adiciona eventos para cada tarefa
tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
});

// Adiciona eventos para cada coluna
columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', dropTask);
});

let draggedTask = null; // Variável para armazenar a task sendo arrastada

function dragStart(e) {
    draggedTask = e.target; // Armazena a task arrastada
    e.dataTransfer.setData('text', e.target.innerHTML);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedTask = null; // Reseta a variável ao final
}

function dragOver(e) {
    e.preventDefault();
}

function dropTask(e) {
    e.preventDefault();

    // Obtém os valores dos inputs
    let descricao = document.getElementById('description').value;
    let alunos = document.getElementById('students').value;
    let prazo = document.getElementById('dueDate').value;

    const radios = document.getElementsByName('priority');
    let prioridade;

    for (const radio of radios) {
        if (radio.checked) {
            prioridade = radio.value; // Obtém o valor do radio button
            break; // Para de iterar uma vez que encontrar o selecionado
        }
    }

    // Verifica se a task está sendo arrastada
    if (!draggedTask) return;

    const targetColumn = e.target.closest('.column'); // Obtém a coluna de destino

    // Verifica se a coluna de destino é a mesma da task arrastada
    if (targetColumn === draggedTask.parentNode) {
        return; // Não faz nada se for a mesma coluna
    }

    // Remove a task da coluna anterior
    draggedTask.parentNode.removeChild(draggedTask);

    // Cria uma nova task na coluna de destino
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.innerHTML = draggedTask.innerHTML; // Copia o conteúdo da task arrastada
    newTask.setAttribute('draggable', 'true');
    newTask.addEventListener('dragstart', dragStart);
    newTask.addEventListener('dragend', dragEnd);
    // Mostrar/ocultar menu de opções
    newTask.querySelector('.options-btn').addEventListener('click', function() {
        const optionsMenu = newTask.querySelector('.options-menu');
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Lógica para remover a task
    newTask.querySelector('.remove-btn').addEventListener('click', function() {
        newTask.remove(); // Remove a task do DOM
    });

    // Lógica para editar a task
    newTask.querySelector('.edit-btn').addEventListener('click', function() {
        const newDescription = prompt("Nova descrição:", descricao);
        const newStudents = prompt("Novos alunos:", alunos);
        const newDueDate = prompt("Novo prazo (DD/MM/AAAA):", prazo);

        if (newDescription) {
            descricao = newDescription;
            newTask.querySelector('p:nth-child(1)').textContent = descricao;
        }
        if (newStudents) {
            alunos = newStudents;
            newTask.querySelector('p:nth-child(2)').textContent = alunos;
        }
        if (newDueDate) {
            prazo = newDueDate;
            newTask.querySelector('#due-date').textContent = `Prazo: ${prazo}`;
        }
    });

    const dueDateElement = newTask.querySelector('#due-date');
    const dueDateText = dueDateElement.textContent.split(': ')[1];
    const dueDate = new Date(dueDateText.split('/').reverse().join('-')); // Converte para YYYY-MM-DD

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparação de datas

    if (dueDate < today) {
        newTask.style.backgroundColor = '#d3d3d3'; // Cor cinza
    }

    // Adiciona a nova task à coluna alvo
    targetColumn.appendChild(newTask);
}

tasks.forEach(task => {
    const dueDateElement = task.querySelector('#due-date');
    const dueDateText = dueDateElement.textContent.split(': ')[1];
    const dueDate = new Date(dueDateText.split('/').reverse().join('-')); // Converte para YYYY-MM-DD

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparação de datas

    if (dueDate < today) {
        task.style.backgroundColor = '#d3d3d3'; // Cor cinza
    }
});

function addTask(event) {
    event.preventDefault(); // Impede o envio do formulário

    let newTask = document.createElement('div');
    
    // Obtém os valores dos inputs
    const descricao = document.getElementById('description').value;
    const alunos = document.getElementById('students').value;
    const prazo = document.getElementById('dueDate').value;

    const radios = document.getElementsByName('priority');
    let prioridade;

    for (const radio of radios) {
        if (radio.checked) {
            prioridade = radio.value; // Obtém o valor do radio button
            break; // Para de iterar uma vez que encontrar o selecionado
        }
    }

    newTask.innerHTML = `<div class="priority ${prioridade}"></div> <!-- Prioridade Alta -->
                <h4 class="title">${descricao}</h4>
                <div class="taskContainer">
                    <p>Alunos: ${alunos}</p>
                    <p>Prioridade: ${prioridade}</p>
                    <p id="due-date">Prazo: ${prazo}</p>
                </div>
                <button class="options-btn btn-success btn">Opções</button>
                <div class="options-menu" style="display: none;">
                    <button class="edit-btn">Editar</button>
                    <button class="remove-btn">Remover</button>
                </div>`;

    newTask.setAttribute('draggable', 'true');
    newTask.classList.add('task')
    newTask.addEventListener('dragstart', dragStart);
    newTask.addEventListener('dragend', dragEnd);

    // Mostrar/ocultar menu de opções
    newTask.querySelector('.options-btn').addEventListener('click', function() {
        const optionsMenu = newTask.querySelector('.options-menu');
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Lógica para remover a task
    newTask.querySelector('.remove-btn').addEventListener('click', function() {
        newTask.remove(); // Remove a task do DOM
    });

    // Lógica para editar a task
    newTask.querySelector('.edit-btn').addEventListener('click', function() {
        const newDescription = prompt("Nova descrição:", descricao);
        const newStudents = prompt("Novos alunos:", alunos);
        const newDueDate = prompt("Novo prazo (DD/MM/AAAA):", prazo);

        if (newDescription) {
            descricao = newDescription;
            newTask.querySelector('p:nth-child(1)').textContent = descricao;
        }
        if (newStudents) {
            alunos = newStudents;
            newTask.querySelector('p:nth-child(2)').textContent = alunos;
        }
        if (newDueDate) {
            prazo = newDueDate;
            newTask.querySelector('#due-date').textContent = `Prazo: ${prazo}`;
        }
    });

    // Verifica a data do prazo
    const dueDateText = prazo; // Aqui usamos a data diretamente do input
    const dueDateParts = dueDateText.split('/');
    const dueDate = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0]); // YYYY, MM (0-indexado), DD

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
        newTask.style.backgroundColor = '#d3d3d3'; // Cor cinza
    }

    // Adiciona a nova task à coluna "A Fazer"
    document.getElementById('a-fazer').appendChild(newTask);

    // Limpa os campos do formulário após adicionar a tarefa
    document.getElementById('description').value = '';
    document.getElementById('students').value = '';
    document.getElementById('dueDate').value = '';
    for (const radio of radios) {
        radio.checked = false;
    }
}

tasks.forEach(task => {

    // Obtém os valores dos inputs
    let descricao = document.getElementById('description').value;
    let alunos = document.getElementById('students').value;
    let prazo = document.getElementById('dueDate').value;

    const radios = document.getElementsByName('priority');
    let prioridade;

    for (const radio of radios) {
        if (radio.checked) {
            prioridade = radio.value; // Obtém o valor do radio button
            break; // Para de iterar uma vez que encontrar o selecionado
        }
    }

    // Mostrar/ocultar menu de opções
    task.querySelector('.options-btn').addEventListener('click', function() {
        const optionsMenu = task.querySelector('.options-menu');
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Lógica para remover a task
    task.querySelector('.remove-btn').addEventListener('click', function() {
        task.remove(); // Remove a task do DOM
    });

    // Lógica para editar a task
    task.querySelector('.edit-btn').addEventListener('click', function() {
        const newDescription = prompt("Nova descrição:", descricao);
        const newStudents = prompt("Novos alunos:", alunos);
        const newDueDate = prompt("Novo prazo (DD/MM/AAAA):", prazo);

        if (newDescription) {
            descricao = newDescription;
            task.querySelector('p:nth-child(1)').textContent = descricao;
        }
        if (newStudents) {
            alunos = newStudents;
            task.querySelector('p:nth-child(2)').textContent = alunos;
        }
        if (newDueDate) {
            prazo = newDueDate;
            task.querySelector('#due-date').textContent = `Prazo: ${prazo}`;
        }
    });

})