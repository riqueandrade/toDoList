# TaskHub - Sistema de Gerenciamento de Tarefas

TaskHub é uma aplicação web moderna para gerenciamento de tarefas em formato Kanban, desenvolvida com HTML, CSS, JavaScript (jQuery) e PHP. O sistema permite organizar tarefas em três estados diferentes: "A Fazer", "Fazendo" e "Pronto".

## Funcionalidades

### Gestão de Tarefas
- Adicionar tarefas com título, descrição, setor e prioridade
- Atribuir responsáveis às tarefas
- Definir datas de vencimento
- Mover tarefas entre colunas (A Fazer → Fazendo → Pronto)
- Editar informações das tarefas
- Excluir tarefas
- Visualização em quadro Kanban

### Gestão de Usuários
- Cadastrar novos usuários
- Editar informações de usuários
- Excluir usuários
- Visualizar lista de usuários cadastrados

### Notificações
- Alerta de tarefas próximas do vencimento (2 dias)
- Indicadores visuais de prioridade
- Destaque para tarefas atrasadas

### Interface
- Design responsivo com Bootstrap 5
- Navegação intuitiva
- Animações suaves
- Ícones do Bootstrap Icons
- Interface moderna e limpa

## Estrutura do Projeto

### Frontend
```
├── index.html           # Página principal (Quadro Kanban)
├── cadastro.html        # Página de gestão de usuários
├── css/
│   ├── common.css      # Estilos compartilhados
│   ├── tasks.css       # Estilos do quadro de tarefas
│   └── cadastro.css    # Estilos da página de usuários
└── js/
    ├── app.js          # Lógica do quadro de tarefas
    ├── cadastro.js     # Lógica da gestão de usuários
    └── nav.js          # Comportamento da navegação
```

### Backend
```
php/
├── db_connection.php    # Configuração do banco de dados
├── script.php          # Manipulação de tarefas (CRUD)
├── cadastrar_usuario.php # Manipulação de usuários (CRUD)
├── get_tasks.php       # API de busca de tarefas
├── get_users.php       # API de busca de usuários
└── check_notifications.php # Verificação de tarefas próximas do vencimento
```

## Configuração

1. Configure seu servidor web (Apache/Nginx) para servir PHP
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
    data_vencimento DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

3. Configure as credenciais do banco de dados em `php/db_connection.php`

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript/jQuery
- PHP
- MySQL
- Bootstrap 5
- Bootstrap Icons

## Segurança

- Proteção contra injeção SQL usando mysqli_real_escape_string
- Validação de dados no frontend e backend
- Sanitização de saída HTML
- Tratamento de erros e exceções

## Melhorias Futuras

- [ ] Implementar autenticação de usuários
- [ ] Adicionar sistema de tags/etiquetas
- [ ] Implementar filtros e busca de tarefas
- [ ] Adicionar gráficos e relatórios
- [ ] Implementar sistema de backup automático
- [ ] Adicionar temas claro/escuro
- [ ] Integrar com serviços de notificação externos
- [ ] Adicionar suporte para anexos
