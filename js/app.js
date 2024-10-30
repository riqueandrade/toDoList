$(document).ready(function () {
    // Carrega a lista de usuários quando a página carrega
    $.ajax({
        url: 'php/get_users.php',
        type: 'GET',
        success: function(response) {
            var users = JSON.parse(response);
            var select = $('#todo-user');
            users.forEach(function(user) {
                select.append($('<option>', {
                    value: user.id_usuario,
                    text: user.nome
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error("Erro ao carregar usuários:", error);
        }
    });

    // Quando o formulário de tarefas é submetido
    $('#todo-form').submit(function (e) {
        e.preventDefault(); // Previne o comportamento padrão
        e.stopPropagation(); // Impede a propagação do evento

        let formData = $(this).serialize();
        
        // Adiciona o ID da tarefa se estiver editando
        if (editingTaskId) {
            formData += '&action=update&id=' + editingTaskId;
        } else {
            formData += '&action=add';
        }

        $.ajax({
            url: 'php/script.php',
            type: 'POST',
            data: formData,
            success: function(response) {
                $('#todo-form')[0].reset();
                editingTaskId = null;
                $('button[type="submit"]').text('Adicionar');
                updateTaskLists();
            },
            error: function(xhr, status, error) {
                console.error("Erro na operação:", error);
            }
        });

        return false; // Garante que o formulário não será submetido normalmente
    });

    // Função para atualizar as listas de tarefas
    function updateTaskLists() {
        $('.card').each(function () {
            var status = $(this).find('.card-header h2').text().trim(); // Adicionado trim()
            var taskList = $(this).find('.task-list');
            taskList.load('php/get_tasks.php?status=' + encodeURIComponent(status));
        });
    }

    // Atualiza as listas de tarefas inicialmente quando o documento está pronto
    updateTaskLists();

    // Evento para mover uma tarefa para o próximo status
    $(document).on('click', '.move-btn', function () {
        var taskId = $(this).data('id'); // Obtém o ID da tarefa
        var currentStatus = $(this).data('status'); // Obtém o status atual da tarefa
        // Define o novo status com base no status atual
        var newStatus = (currentStatus === 'A Fazer') ? 'Fazendo' :
            (currentStatus === 'Fazendo') ? 'Pronto' : 'A Fazer';

        // Envia uma requisição AJAX para mover a tarefa
        $.ajax({
            url: 'php/script.php',
            type: 'POST',
            data: {
                action: 'move', // Ação de mover
                id: taskId, // ID da tarefa
                new_status: newStatus // Novo status da tarefa
            },
            success: function (response) {
                // Atualiza as listas de tarefas após mover
                updateTaskLists();
            },
            error: function (xhr, status, error) {
                // Loga um erro no console se a requisição falhar
                console.error("Erro ao mover tarefa:", error);
            }
        });
    });

    // Evento para excluir uma tarefa
    $(document).on('click', '.delete-btn', function (e) {
        e.preventDefault(); // Previne qualquer comportamento padrão
        
        var confirmDelete = window.confirm('Tem certeza que deseja excluir esta tarefa?');
        
        if (confirmDelete) {
            var taskId = $(this).data('id'); // Obtém o ID da tarefa

            // Envia uma requisição AJAX para excluir a tarefa
            $.ajax({
                url: 'php/script.php',
                type: 'POST',
                data: {
                    action: 'delete', // Ação de excluir
                    id: taskId // ID da tarefa
                },
                success: function (response) {
                    // Atualiza as listas de tarefas após exclusão
                    updateTaskLists();
                },
                error: function (xhr, status, error) {
                    // Loga um erro no console se a requisição falhar
                    console.error("Erro ao excluir tarefa:", error);
                }
            });
        }
    });

    // No início do documento.ready, após as funções existentes:
    let editingTaskId = null;

    // Evento para editar uma tarefa
    $(document).on('click', '.edit-btn', function() {
        editingTaskId = $(this).data('id');
        
        // Preenche o formulário com os dados da tarefa
        $('#todo-input').val($(this).data('task'));
        $('#todo-description').val($(this).data('description'));
        $('#todo-sector').val($(this).data('sector'));
        $('#todo-priority').val($(this).data('priority'));
        $('#todo-user').val($(this).data('user'));
        
        // Muda o texto do botão
        $('button[type="submit"]').text('Atualizar Tarefa');
        
        // Scroll suave até o formulário
        $('html, body').animate({
            scrollTop: $('#todo-form').offset().top - 100
        }, 500);
    });
});

// Explicação do código:

// 1. O código está envolvido em $(document).ready() para garantir que ele só seja executado quando o DOM estiver completamente carregado.

// 2. Manipulação do formulário:
//    - Quando o formulário é submetido, o evento padrão é prevenido.
//    - Uma requisição AJAX é enviada para adicionar uma nova tarefa.
//    - Após o sucesso, o formulário é resetado e a lista de tarefas é atualizada.

// 3. Função updateTaskLists():
//    - Atualiza todas as listas de tarefas.
//    - Para cada coluna, obtém o status e carrega as tarefas correspondentes do servidor.

// 4. Evento de mover tarefa:
//    - Acionado quando o botão de mover é clicado.
//    - Obtém o ID da tarefa e seu status atual.
//    - Determina o novo status com base no status atual.
//    - Envia uma requisição AJAX para atualizar o status da tarefa no servidor.
//    - Após o sucesso, atualiza as listas de tarefas.

// 5. Evento de excluir tarefa:
//    - Acionado quando o botão de excluir é clicado.
//    - Obtém o ID da tarefa.
//    - Envia uma requisição AJAX para excluir a tarefa no servidor.
//    - Após o sucesso, atualiza as listas de tarefas.

// 6. Tratamento de erros:
//    - Todos os erros de AJAX são logados no console para facilitar a depuração.
