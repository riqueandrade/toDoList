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
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            $.ajax({
                url: 'php/cadastrar_usuario.php',
                type: 'POST',
                data: {
                    action: 'delete',
                    id: id
                },
                success: function(response) {
                    var result = JSON.parse(response);
                    if (result.success) {
                        alert('Usuário excluído com sucesso!');
                        loadUsers();
                    } else {
                        alert('Erro ao excluir: ' + result.error);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Erro ao excluir usuário:", error);
                    alert('Erro ao excluir usuário. Tente novamente.');
                }
            });
        }
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
                    alert(editingId ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
                    $('#user-form')[0].reset();
                    editingId = null;
                    $('button[type="submit"]').text('Cadastrar');
                    $('.card-header h1').text('Cadastro de Usuário');
                    loadUsers();
                } else {
                    alert('Erro: ' + result.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na operação:", error);
                alert('Erro. Tente novamente.');
            }
        });
    });

    // Carrega os usuários quando a página carrega
    loadUsers();
});
