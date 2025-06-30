# Sistema World Beauty — Atividade V

**Aplicação SPA completa:** Frontend React + Backend Java REST, com CRUD, integração total e relatórios analíticos.

---

## Objetivo

Implementar uma **Single Page Application (SPA)** moderna, integrando:

- **Frontend React + TypeScript**
- **Backend Java + Spring Boot (RESTful API)**
- **CRUD completo** para clientes, produtos, serviços e consumos
- **Registro de consumo** com quantidade
- **6 relatórios analíticos obrigatórios**
- **Banco H2 em memória**, com dados de teste automáticos

---

## Estrutura do Projeto

```
T5/
├── backend/           # Java Spring Boot REST API
├── frontend/          # React + TypeScript (SPA)
├── executavel/        # JAR backend pronto
└── README.md
```

### Comunicação

```
Frontend (React SPA) ←→ JSON/HTTP ←→ Backend (Java REST) ←→ Banco H2
```

---

## Funcionalidades

- **CRUD completo**: clientes, produtos, serviços, consumos
- **Campos obrigatórios**: nome, CPF, RG, gênero, endereço, telefones etc.
- **Registro de consumo**: vínculo cliente-produto/serviço + quantidade
- **Relatórios especiais**:
  1. Top 10 clientes por quantidade consumida
  2. Todos clientes por gênero
  3. Produtos/serviços mais consumidos (geral)
  4. Produtos/serviços mais consumidos por gênero
  5. Top 10 clientes que menos consumiram
  6. Top 5 clientes que mais consumiram em valor
- **SPA real**: navegação fluida entre telas sem recarregar página
- **Responsivo**: acessível em desktop e mobile

---

## Endpoints REST

Exemplos principais:

| Método   | Rota                 | Descrição               |
| -------- | -------------------- | ----------------------- |
| `GET`    | `/clientes`          | Lista todos os clientes |
| `POST`   | `/cliente/cadastrar` | Cadastra cliente        |
| `PUT`    | `/cliente/atualizar` | Atualiza cliente        |
| `DELETE` | `/cliente/excluir`   | Remove cliente          |
| `GET`    | `/relatorios/*`      | Relatórios analíticos   |

**Frontend:** [http://localhost:5173](http://localhost:5173)\
**Backend:** [http://localhost:8080](http://localhost:8080)\
**Banco H2 Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## Como Executar

### Usar JAR

```
# Backend
cd executavel
java -jar wbbackend.jar

# Frontend
cd frontend
npm install
npm run dev
```

### Rodar pelo código-fonte

```
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

**Requisitos:** Java 17+, Node.js, Maven

---

## Banco de Dados

- **H2** em memória, recriado a cada execução
- Acesso: `/h2-console` | JDBC: `jdbc:h2:mem:[id]` | Usuário: `SA`

---

## Tecnologias

**Backend:**

- Java 21, Spring Boot 3, JPA/Hibernate, Lombok, H2 Database

**Frontend:**

- React 19, TypeScript, Vite, Material-UI, Axios, Hooks, React Router

---

## Testes

- 30 clientes + 20 produtos/serviços cadastrados automaticamente
- Consumos realistas pré-gerados
- Teste manual: acesse `/clientes` ou use ferramenta REST

---

## Resumo Arquitetural

- **RESTful API**, separação de responsabilidades
- **SPA** com roteamento dinâmico
- **Comunicação JSON**
- **Responsividade** garantida

---

**Disciplina:** Programação Orientada a Objetos\
**Professor:** Dr. Eng. Gerson Penha\
**Aluna:** Mariana Lins  
**Atividade V:** SPA Completa e Relatórios Analíticos

