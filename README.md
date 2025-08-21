# 🚀 Desafio IBM Caixa

Repositório desenvolvido para o **Desafio IBM Caixa**, contendo o backend da aplicação, documentação de API e diagramas de suporte ao entendimento do sistema.

---

## 📂 Estrutura do Repositório

├── backend/ # Projeto backend em Spring Boot
│ ├── Dockerfile
│ ├── docker-compose.yaml
│ ├── pom.xml
│ └── ...
│
├── src/ # Código-fonte principal do backend
│ └── ...
│
├── docs/ # Documentação do projeto
│ ├── modelo entidade relacionamento - mer.pdf
│ ├── Doc_API.md
│ └── fluxo-aplicacao.jpg

---

## ⚙️ Tecnologias Utilizadas

- **Java 17** (Spring Boot)  
- **MySQL** (banco de dados relacional)  
- **Next.js** (frontend)  
- **IBM Cloud**  
- **IBM AKM (Advanced Knowledge Management)**  

---

## 📖 Fluxo da Aplicação

O fluxo da aplicação está descrito em docs/fluxo-aplicacao.jpg.
Ele contempla dois agentes principais:

### Agente de Ideias: responsável por cadastrar ideias, verificar similaridades e registrar projetos.

### Agente de Problemas: responsável por cadastrar problemas, categorizá-los e integrá-los ao sistema.

No final do processo, o sistema realiza match de ideias e problemas por categoria e score.

---
### 🗂️ Modelo de Dados

O modelo entidade-relacionamento (MER) está em docs/modelo entidade relacionamento - mer.pdf.
Ele define as entidades principais:

### PROBLEMAS

id, nome, matrícula, unidade, email, descrição do problema, processo, categoria, impacto financeiro, tipo de solução esperada, impacto em pessoas, status, matching_score, data_criacao

### IDEIAS

id, nome_proponente, matrícula_proponente, unidade_proponente, nome_experimento, equipe envolvida, desafio_problema, solucao_descricao, metodologia_execucao, hipótese_principal, horizonte_inovacao, baseline_atual, resultados_esperados, kpis_smart, categoria, status, avaliação_ia, avaliação_humana

### Enums

CategoriaEnum: OPERACIONAL, TECNOLOGICA, ATENDIMENTO, ...

UrgenciaEnum: ALTA, MEDIA, BAIXA

Status: ABERTO, EM_ANALISE, VALIDADO, REJEITADO, IMPLEMENTADO

---

## 🛠️ Backend

O backend foi desenvolvido em **Java 17** utilizando **Spring Boot 3** e **Maven** para gerenciamento de dependências.  
Conta com configuração para execução em **Docker** e **Docker Compose**.

### ▶️ Como executar

#### Usando Maven
```bash
# Clonar o repositório
git clone https://github.com/YASMINCOS/desafio-ibm-caixa.git

# Entrar no diretório backend
cd desafio-ibm-caixa/backend

# Executar aplicação
./mvnw spring-boot:run
```
## 💻 Frontend

O frontend foi desenvolvido em **Next JS**



### ▶️ Como executar

```bash
# Clonar o repositório
git clone https://github.com/YASMINCOS/desafio-ibm-caixa.git

# Entrar no diretório hopper
cd desafio-ibm-caixa/hopper

# Executar aplicação
npm install 

npm run dev
```

