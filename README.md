# Lista de Tarefas Avançada

Este projeto é uma aplicação web de Lista de Tarefas (To-Do List) avançada, desenvolvida com HTML, CSS, JavaScript (jQuery) e PHP. Ela permite aos usuários adicionar, mover e excluir tarefas em três colunas diferentes: "A Fazer", "Fazendo" e "Pronto".

## Funcionalidades

- Adicionar novas tarefas com título, descrição, setor e prioridade
- Visualizar tarefas em três colunas diferentes (A Fazer, Fazendo, Pronto)
- Mover tarefas entre as colunas
- Excluir tarefas
- Interface responsiva que se adapta a diferentes tamanhos de tela

## Estrutura do Projeto

- `index.html`: Página principal da aplicação
- `style.css`: Estilos CSS para a interface do usuário
- `app.js`: Lógica JavaScript/jQuery para interações do usuário e requisições AJAX
- `script.php`: Script PHP para processar requisições do cliente (adicionar, mover, excluir tarefas)
- `get_tasks.php`: Script PHP para buscar e exibir tarefas
- `db_connection.php`: Configurações de conexão com o banco de dados

## Configuração

1. Configure seu servidor web (como Apache) para servir os arquivos PHP.
2. Crie um banco de dados MySQL usando os seguintes comandos:

   ```sql
   CREATE DATABASE IF NOT EXISTS to_do_list
   CHARACTER SET utf8mb4
   COLLATE utf8mb4_unicode_ci;

   USE to_do_list;

   CREATE TABLE usuarios (
       id_usuario INT AUTO_INCREMENT PRIMARY KEY,
       nome VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE tarefas (
       id_tarefas INT AUTO_INCREMENT PRIMARY KEY,
       tarefa VARCHAR(255) NOT NULL,
       descricao TEXT,
       setor VARCHAR(100),
       prioridade VARCHAR(10) NOT NULL,
       status VARCHAR(20) NOT NULL,
       id_usuario INT,
       FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
   );
   ```

3. Ajuste as credenciais do banco de dados no arquivo `db_connection.php` se necessário.

## Como Usar

1. Abra o `index.html` em seu navegador.
2. Use o formulário no topo para adicionar novas tarefas.
3. As tarefas aparecerão na coluna "A Fazer".
4. Use os botões "Mover" para mover as tarefas entre as colunas.
5. Use o botão "Excluir" para remover uma tarefa.

## Detalhes Técnicos

### Frontend (HTML/CSS/JavaScript)

- O layout é criado usando HTML5 e estilizado com CSS3.
- JavaScript (jQuery) é usado para manipulação do DOM e requisições AJAX.
- A responsividade é alcançada usando media queries no CSS.

### Backend (PHP)

- PHP é usado para processar requisições do cliente e interagir com o banco de dados.
- As operações de banco de dados são realizadas usando MySQLi.
- Os dados são retornados em formato JSON para fácil manipulação no frontend.

### Segurança

- Todas as entradas do usuário são escapadas para prevenir injeção de SQL.
- As senhas e informações sensíveis do banco de dados devem ser protegidas em um ambiente de produção.

## Melhorias Futuras

- Implementar autenticação de usuários
- Adicionar funcionalidade de edição de tarefas
- Implementar filtros e busca de tarefas
- Adicionar data de vencimento às tarefas
- Implementar notificações para tarefas próximas do vencimento
