const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');
var coluna_a_fazer = document.getElementById('a-fazer');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const editForm = document.getElementById('editForm');
const userId = Cookies.get('userId');

let currentTaskId = null; // ID da tarefa atual sendo editada

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

async function dropTask(e) {
    e.preventDefault();

    // Verifica se a task está sendo arrastada
    if (!draggedTask) return;

    var idTask = draggedTask.id
    let descricao = draggedTask.dataset.descricao
    let prioridade = draggedTask.dataset.prioridade
    let alunos = draggedTask.dataset.alunos
    let prazo = draggedTask.dataset.prazo
    console.log(draggedTask)

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
    newTask.setAttribute('id', idTask);
    newTask.setAttribute('data-prazo',prazo);
    newTask.setAttribute('data-alunos',alunos);
    newTask.setAttribute('data-prioridade',prioridade);
    newTask.setAttribute('data-descricao',descricao);
    newTask.addEventListener('dragstart', dragStart);
    newTask.addEventListener('dragend', dragEnd);
    newTask.setAttribute('draggable', 'true');
    // Mostrar/ocultar menu de opções
    newTask.querySelector('.options-btn').addEventListener('click', function() {
        const optionsMenu = newTask.querySelector('.options-menu');
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Lógica para remover a task
    newTask.querySelector('.remove-btn').addEventListener('click', async function() {
        try {
            const response = await fetch(`http://135.181.89.240:8011/assuntos/${idTask}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {

                newTask.remove();
                alert("Tarefa deletada com sucesso!");
                
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message || 'Não foi possível deletar a tarefa.'}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar a tarefa.');
        }
    });

    newTask.querySelector('.edit-btn').addEventListener('click', function() {
    openEditModal(idTask, descricao, alunos, prioridade, prazo);
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

    data = {
        status: `${targetColumn.id}` 
    }
    const response = await fetch(`http://135.181.89.240:8011/alterarStatus/${idTask}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
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


async function loadTasks() {

    console.log(userId)
    document.getElementById('loading').style.display = 'flex'; // Mostra o indicador de carregamento

    try {
        const response = await fetch(`http://135.181.89.240:8011/assuntos?usuario=${userId}`);
        const tasks = await response.json();
        console.log(tasks);

        for (let task of tasks) {
            let newTask = document.createElement('div');
            // Obtém os valores dos inputs
            const descricao = task.descricao;
            const alunos = task.alunos;
            const prazo = task.prazo;
            let prioridade = task.prioridade;

            newTask.innerHTML = `<div class="priority ${prioridade}"></div>
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

            newTask.setAttribute('id', task.id);
            newTask.setAttribute('data-prazo',prazo);
            newTask.setAttribute('data-alunos',alunos);
            newTask.setAttribute('data-prioridade',prioridade);
            newTask.setAttribute('data-descricao',descricao);
            newTask.setAttribute('draggable', 'true');
            newTask.classList.add('task');
            newTask.addEventListener('dragstart', dragStart);
            newTask.addEventListener('dragend', dragEnd);

            newTask.querySelector('.options-btn').addEventListener('click', function() {
                const optionsMenu = newTask.querySelector('.options-menu');
                optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
            });

            newTask.querySelector('.remove-btn').addEventListener('click', async function() {
                try {
                    const response = await fetch(`http://135.181.89.240:8011/assuntos/${task.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if (response.ok) {

                        newTask.remove();
                        alert("Tarefa deletada com sucesso!");
                        
                    } else {
                        const error = await response.json();
                        alert(`Erro: ${error.message || 'Não foi possível deletar a tarefa.'}`);
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao deletar a tarefa.');
                }
            });

            newTask.querySelector('.edit-btn').addEventListener('click', function() {
                openEditModal(task.id, descricao, alunos, prioridade, prazo);
            });
            

            const dueDateText = prazo;
            const dueDateParts = dueDateText.split('/');
            const dueDate = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0]);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dueDate < today) {
                newTask.style.backgroundColor = '#d3d3d3';
            }

            console.log(task.status);
            document.getElementById(task.status).appendChild(newTask);
        }
    } catch (error) {
        console.error('Erro ao carregar as tarefas:', error);
    } finally {
        document.getElementById('loading').style.display = 'none'; // Oculta o indicador de carregamento
    }
}

function openEditModal(taskId, descricao, alunos, prioridade, prazo) {
    currentTaskId = taskId; // Define o ID da tarefa a ser editada
    document.getElementById("editDescricao").value = descricao;
    document.getElementById("editAlunos").value = alunos;
   
    // Converter a data do formato DD/MM/AAAA para YYYY-MM-DD
    const [dia, mes, ano] = prazo.split('/');
    const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    document.getElementById("editPrazo").value = dataFormatada;
    // Marcar o rádio de prioridade
    const priorityRadio = document.querySelector(`input[name="prioridade"][value="${prioridade}"]`);
    if (priorityRadio) {
        priorityRadio.checked = true;
    } else {
        console.error("Botão de rádio de prioridade não encontrado");
    }

    editModal.style.display = 'block'; // Abre o modal
}



// Fecha o modal
closeModal.onclick = function() {
    editModal.style.display = 'none';
};

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
};

// Manipula o envio do formulário de edição
editForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const descricao = document.getElementById('editDescricao').value;
    const alunos = document.getElementById('editAlunos').value;
    const prioridade = document.querySelector('input[name="prioridade"]:checked').value;
    const prazo = document.getElementById('editPrazo').value;

    // Verifica se a data selecionada é válida (não passada)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(prazo);

    if (selectedDate < today) {
        alert("A data selecionada já passou. Selecione uma nova data.");
        return;
    }

    // Dados a serem enviados no PUT
    const data = {
        descricao: descricao,
        alunos: alunos,
        prioridade: prioridade,
        prazo: prazo.split('-').reverse().join('/'), // Converte para DD/MM/YYYY
        usuario: "1" // Ajuste para o ID do usuário correto
    };

    try {
        const response = await fetch(`http://135.181.89.240:8011/editarAssunto/${currentTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Tarefa atualizada com sucesso!");

            // Fechar o modal e recarregar a página para exibir a atualização
            editModal.style.display = 'none';
            location.reload();
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message || 'Não foi possível atualizar a tarefa.'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar a tarefa.');
    }
});

// Certifique-se de ter incluído a biblioteca js-cookie se você estiver usando
// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js"></script>

function logout() {
    // Remove o cookie do usuário
    Cookies.remove('userId'); // Substitua 'userId' pelo nome do seu cookie, se diferente

    // Redireciona para a página de login
    window.location.href = 'login.html'; // Altere para o caminho da sua página de login
}

// Exemplo de uso: vincular essa função a um botão de logout
document.getElementById('logout').addEventListener('click', logout);

window.onload = loadTasks