---
## IBM x Caixa Desafio

Este repositório foi criado para o **Desafio IBM x Caixa**, um desafio de programação que foca em habilidades de desenvolvimento de software.

O desafio consiste em criar agentes de IA, utilizando o WatsonX da IBM CLOUD, que se comuniquem via API e guie o colaborador da Caixa Econômica Federal a cadastras novos problemas encontrados em sua rotina de trabalho e também ideias de soluções para problemas existentes.


---

## Estrutura do Repositório

### 📌 Backend - Desafio IBM Caixa

Este é o backend do projeto **Desafio IBM Caixa**, desenvolvido em **Java 17** utilizando o framework **Spring Boot 3**.  
O objetivo deste serviço é fornecer a camada de API e persistência de dados para o sistema, garantindo escalabilidade, modularidade e integração com o frontend.

---

### ⚙️ Tecnologias utilizadas

- **Java 17**  
- **Spring Boot 3**  
- **Maven** (gerenciamento de dependências)


##### `controllers`
Este diretório armazena a lógica de controle para as rotas da API.
* **`accountController.js`**: Lógica para operações relacionadas a contas, como criação de conta, login e transações.

##### `models`
Este diretório define os modelos de dados da aplicação.
* **`account.js`**: Modelo de dados para a tabela de contas no banco de dados, utilizando o **Sequelize**.

##### `routes`
Este diretório define as rotas da API.
* **`accountRoutes.js`**: Define as rotas para as operações relacionadas a contas (`/accounts`).

##### `middlewares`
Este diretório contém middlewares para autenticação e validação.
* **`auth.js`**: Middleware para autenticação de token JWT.
* **`validation.js`**: Middleware para validação de dados de entrada.

---

## 🚀 Como executar o backend

### 🔹 Usando Maven
```bash
# Clonar o repositório
git clone https://github.com/YASMINCOS/desafio-ibm-caixa.git

# Entrar no diretório do backend
cd desafio-ibm-caixa/backend

# Executar a aplicação
./mvnw spring-boot:run

### Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/YASMINCOS/desafio-ibm-caixa.git](https://github.com/YASMINCOS/desafio-ibm-caixa.git)
    cd desafio-ibm-caixa
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```
    DB_HOST=seu_host_do_banco
    DB_USER=seu_usuario_do_banco
    DB_PASSWORD=sua_senha_do_banco
    DB_NAME=seu_nome_do_banco
    DB_PORT=sua_porta_do_banco
    JWT_SECRET=sua_chave_secreta_jwt
    ```
4.  **Execute o servidor:**
    ```bash
    npm start
    ```

A API estará rodando em `http://localhost:3000`.

---

### Tecnologias Utilizadas

* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize** (ORM)
* **JSON Web Tokens (JWT)** para autenticação
* **Bcrypt** para criptografia de senhas