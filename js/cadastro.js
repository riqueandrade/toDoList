$(document).ready(function () {
    let editingId = null;

    // Função para carregar a lista de usuários
    function loadUsers() {
        $.ajax({
            url: 'php/get_users.php',
            type: 'GET',
            success: function(response) {
                var users = JSON.parse(response);
                var usersList = $('#users-list');
                usersList.empty();

                users.forEach(function(user) {
                    var date = new Date(user.data_cadastro);
                    var formattedDate = date.toLocaleDateString('pt-BR');
                    
                    var row = $('<tr>').append(
                        $('<td>').text(user.nome),
                        $('<td>').text(user.email),
                        $('<td>').text(formattedDate),
                        $('<td>').addClass('text-end').append(
                            $('<button>')
                                .addClass('btn btn-outline-primary btn-sm me-2')
                                .attr('title', 'Editar')
                                .html('<i class="bi bi-pencil-fill"></i>')
                                .click(function() { editUser(user); }),
                            $('<button>')
                                .addClass('btn btn-outline-danger btn-sm')
                                .attr('title', 'Excluir')
                                .html('<i class="bi bi-trash-fill"></i>')
                                .click(function() { deleteUser(user.id_usuario); })
                        )
                    );
                    usersList.append(row);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erro ao carregar usuários:", error);
            }
        });
    }

    // Função para editar usuário
    function editUser(user) {
        editingId = user.id_usuario;
        $('#nome').val(user.nome);
        $('#email').val(user.email);
        $('button[type="submit"]').text('Atualizar');
        $('.card-header h1').text('Editar Usuário');
    }

    // Função para deletar usuário
    function deleteUser(id) {
        // Configura o modal para confirmação de exclusão
        const modal = document.getElementById('feedbackModal');
        const modalTitle = modal.querySelector('#modalTitle');
        const modalMessage = modal.querySelector('#modalMessage');
        const modalHeader = modal.querySelector('.modal-header');
        const modalFooter = modal.querySelector('.modal-footer');
        
        modalHeader.className = 'modal-header bg-danger text-white';
        modalTitle.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Exclusão';
        modalMessage.textContent = 'Tem certeza que deseja excluir este usuário?';
        
        // Substitui os botões do footer
        modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDelete">Excluir</button>
        `;
        
        // Mostra o modal
        const feedbackModal = new bootstrap.Modal(modal);
        feedbackModal.show();
        
        // Adiciona evento ao botão de confirmar
        document.getElementById('confirmDelete').onclick = function() {
            $.ajax({
                url: 'php/cadastrar_usuario.php',
                type: 'POST',
                data: {
                    action: 'delete',
                    id: id
                },
                success: function(response) {
                    var result = JSON.parse(response);
                    feedbackModal.hide(); // Esconde o modal de confirmação
                    
                    if (result.success) {
                        showFeedback(true, 'Usuário excluído com sucesso!');
                        loadUsers();
                    } else {
                        showFeedback(false, 'Erro ao excluir: ' + result.error);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Erro ao excluir usuário:", error);
                    feedbackModal.hide();
                    showFeedback(false, 'Erro ao excluir usuário. Tente novamente.');
                }
            });
        };
    }

    // Função para mostrar o modal de feedback
    function showFeedback(success, message) {
        const modal = document.getElementById('feedbackModal');
        const modalTitle = modal.querySelector('#modalTitle');
        const modalMessage = modal.querySelector('#modalMessage');
        const modalHeader = modal.querySelector('.modal-header');
        const modalFooter = modal.querySelector('.modal-footer');
        
        // Configura o estilo baseado no tipo de mensagem
        if (success) {
            modalHeader.className = 'modal-header bg-success text-white';
            modalTitle.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sucesso';
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            `;
        } else {
            modalHeader.className = 'modal-header bg-danger text-white';
            modalTitle.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Erro';
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">OK</button>
            `;
        }
        
        modalMessage.textContent = message;
        
        // Mostra o modal
        const feedbackModal = new bootstrap.Modal(modal);
        feedbackModal.show();
    }

    // Manipula o envio do formulário
    $('#user-form').submit(function (e) {
        e.preventDefault();
        
        let formData = $(this).serialize();
        if (editingId) {
            formData += '&action=update&id=' + editingId;
        } else {
            formData += '&action=add';
        }

        $.ajax({
            url: 'php/cadastrar_usuario.php',
            type: 'POST',
            data: formData,
            success: function (response) {
                var result = JSON.parse(response);
                if (result.success) {
                    showFeedback(true, editingId ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
                    $('#user-form')[0].reset();
                    editingId = null;
                    $('button[type="submit"]').text('Cadastrar');
                    $('.card-header h1').text('Cadastro de Usuário');
                    loadUsers();
                } else {
                    showFeedback(false, 'Erro: ' + result.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na operação:", error);
                showFeedback(false, 'Erro ao realizar operação. Tente novamente.');
            }
        });
    });

    // Carrega os usuários quando a página carrega
    loadUsers();
});
