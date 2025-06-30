# Sistema World Beauty - Atividade V
**SPA Completa: Integração Frontend React + Backend REST API + Relatórios Analíticos**

---

## Objetivo da Atividade

Desenvolver uma aplicação **SPA** (Single Page Application) completa, integrando **frontend React + TypeScript** com **backend Java Spring Boot**, permitindo:
- **CRUD completo** de clientes, produtos, serviços e consumos
- **Registro de consumo** com quantidade
- **Relatórios analíticos** (6 tipos obrigatórios)
- **Integração total** frontend-backend
- **População automática** de dados de teste

---

## Arquitetura Implementada

```
ATV5/
├── backend/           # Spring Boot + Java (API REST)
├── frontend/          # React + TypeScript (SPA)
├── executavel/        # JAR para execução rápida
└── README.md         # Esta documentação
```

### Fluxo de Comunicação
```
Frontend (React SPA) ──── JSON via HTTP ──── Backend (Java)
     ↕                                        ↕
Interface Gráfica                      Banco H2 (memória)
```

---

## Especificações da Atividade

### Requisitos Atendidos

- **CRUD completo** para clientes, produtos, serviços, consumos
- **Registro de consumo** com campo quantidade
- **Endpoints REST** para todos os recursos e relatórios
- **6 relatórios analíticos** obrigatórios
- **Campos obrigatórios**: nome, nome social, CPF, RG, gênero, endereço, telefones, etc.
- **Integração SPA**: navegação entre todas as telas sem recarregar
- **Dados de teste**: sistema populado automaticamente

---

## Endpoints REST Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clientes` | Lista todos os clientes |
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/servicos` | Lista todos os serviços |
| `GET` | `/consumo/consumos` | Lista todos os consumos |
| `POST` | `/cliente/cadastrar` | Cadastra novo cliente |
| `POST` | `/produto/cadastrar` | Cadastra novo produto |
| `POST` | `/servico/cadastrar` | Cadastra novo serviço |
| `POST` | `/consumo/cadastrar` | Registra consumo |
| `PUT` | `/cliente/atualizar` | Atualiza cliente |
| `PUT` | `/produto/atualizar` | Atualiza produto |
| `PUT` | `/servico/atualizar` | Atualiza serviço |
| `PUT` | `/consumo/atualizar` | Atualiza consumo |
| `DELETE` | `/cliente/excluir` | Exclui cliente |
| `DELETE` | `/produto/excluir` | Exclui produto |
| `DELETE` | `/servico/excluir` | Exclui serviço |
| `DELETE` | `/consumo/excluir` | Exclui consumo |
| `GET` | `/relatorios/*` | 6 relatórios analíticos obrigatórios |

### URLs de Acesso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console

---

## Como Executar

### Opção 1: Execução Rápida (JAR)
```powershell
# Terminal 1: Backend
cd executavel
java -jar wbbackend.jar --server.port=8080

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev
```

### Opção 2: Desenvolvimento (Código Fonte)
```powershell
# Terminal 1: Backend
cd backend
.\mvnw.cmd spring-boot:run

# Terminal 2: Frontend
cd frontend  
npm install
npm run dev
```

### Pré-requisitos
- **Java 17+** (para executar backend)
- **Node.js** (para executar frontend)
- **Maven** (se compilar backend do código fonte)

### Troubleshooting

#### Backend não inicia na porta 8080
**Problema**: Porta pode estar em uso por outro serviço
**Solução**: Pare outros serviços na porta 8080 ou use uma porta alternativa:
```powershell
java -jar wbbackend.jar --server.port=8081
```
Lembre-se de atualizar também a configuração do frontend em `src/config/api.ts`.

#### API não está disponível
1. **Verifique se o backend está rodando**: Veja se há logs de inicialização
2. **Confirme a porta**: Deve mostrar "Tomcat started on port(s): 8080"
3. **Teste manualmente**: Acesse http://localhost:8080/clientes no browser
4. **Verifique conflitos**: Certifique-se que a porta 8080 não está em uso

---

## Tecnologias Utilizadas

### Backend (Java)
- **Java 21** + **Spring Boot 3.2.0**
- **JPA/Hibernate** (persistência)
- **Lombok** (redução de código)
- **H2 Database** (banco em memória)
- **Maven** (gerenciamento de dependências)
- **HATEOAS** (navegação REST)

### Frontend (React)
- **React 19** + **TypeScript**
- **Material-UI** (interface moderna)
- **Axios** (cliente HTTP)
- **Vite** (build tool e dev server)
- **Hooks** (gerenciamento de estado)

---

## Funcionalidades Implementadas

### CRUD Completo
- **Clientes**: cadastro, listagem, edição, exclusão
- **Produtos**: cadastro, listagem, edição, exclusão
- **Serviços**: cadastro, listagem, edição, exclusão
- **Consumos**: registro, listagem, **edição completa**, exclusão
  - **Edição total**: cliente, produto/serviço, quantidade
  - **Interface por abas**: registro e gerenciamento separados
  - **Validação em tempo real** e preview do total

### Relatórios Analíticos
- 6 relatórios obrigatórios, integrados ao backend
- Visualização em tempo real

### Interface Gráfica
- **SPA moderna** com Material-UI
- **Validação em tempo real** de formulários
- **Feedback visual** (loading, sucesso, erro)
- **Tratamento de erros** da API
- **Navegação SPA** entre todas as telas
- **Consumos**: interface por abas (registro + gerenciamento)
- **Dialog de edição**: formulário completo com preview

### Gestão de Dados
- **30 clientes, 20 produtos/serviços, consumos** pré-carregados
- **Dados em memória** (reinicia a cada execução)
- **Validação de campos** obrigatórios
- **Campos simulados**: CPF, RG, gênero (frontend)
- **Consumos realistas**: dados sintéticos distribuídos no tempo

---

## Comandos de Teste (PowerShell)

```powershell
# Testar API - Listar clientes
Invoke-RestMethod -Uri "http://localhost:8080/clientes" -Method GET

# Testar API - Listar consumos com dados aninhados
Invoke-RestMethod -Uri "http://localhost:8080/consumo/consumos" -Method GET

# Testar API - Buscar cliente específico  
Invoke-RestMethod -Uri "http://localhost:8080/cliente/1" -Method GET

# Verificar se frontend está rodando
Invoke-RestMethod -Uri "http://localhost:5173" -Method GET
```

---

## Detalhes Técnicos

### Estrutura do Banco
```sql
-- Tabelas criadas automaticamente pelo Hibernate
Cliente (id, nome, sobreNome, email, endereco_id, ...)
Endereco (id, estado, cidade, bairro, rua, numero, codigoPostal, informacoesAdicionais)  
Telefone (id, ddd, numero)
Produto (id, nome, descricao, preco, categoria)
Servico (id, nome, descricao, preco, categoria)
Consumo (id, cliente_id, produto_id, servico_id, dataHora, quantidade)
Cliente_Telefones (cliente_id, telefones_id)
```

### Configurações de Rede
- **Backend**: Porta 8080 (padrão Spring Boot)
- **Frontend**: Porta 5173 (ou próxima disponível)
- **CORS**: Configurado para http://localhost:5173
- **Content-Type**: application/json

### Validações
- **Frontend**: Campos obrigatórios, formatos de email/telefone
- **Backend**: Validação JPA automática
- **Integração**: Apenas campos suportados enviados à API

---

## Observações Importantes

### Sobre o Lombok
- **Uso**: Gera automaticamente getters/setters via anotações
- **IDE**: Pode mostrar "erros" falsos (ignore)
- **Maven**: Compila perfeitamente (é o que importa)
- **Vantagem**: 80% menos código manual

### Sobre o Banco H2
- **Tipo**: Em memória (dados perdidos ao reiniciar)
- **Console**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:[id-gerado]` (ver logs)
- **Usuário**: `SA` | **Senha**: (vazio)

### Campos Simulados
- **CPF, RG, Gênero**: Apenas no frontend (UX melhorada)
- **Não são enviados** para o backend
- **Demonstram separação** de responsabilidades

---

## Estrutura Conforme Atividade

### Aspectos Arquiteturais Atendidos
1. **Separação de responsabilidades** 
2. **Comunicação modular** via JSON 
3. **Frontend independente** do backend 
4. **Sistema stateless** 
5. **Flexibilidade da interface** 

### Aprendizados Demonstrados
- **Integração Frontend-Backend** via REST
- **Comunicação HTTP** com tratamento de erros
- **Arquitetura de microsserviços** (princípios)
- **Separação UI/Dados** na prática
- **Desenvolvimento modular** e independente

---

**Disciplina**: Programação Orientada a Objetos  
**Professor**: Dr. Eng. Gerson Penha  
**Atividade**: V - SPA Completa e Relatórios Analíticos  
