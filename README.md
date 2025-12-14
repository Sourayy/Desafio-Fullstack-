
# Desafio Full-Stack

## 📌 Introdução

Este projeto foi desenvolvido como parte de um **Desafio Full-Stack**, cujo objetivo é demonstrar habilidades técnicas, de desenvolvimento e organização, tanto no **Back-end** quanto no **Front-end**. A aplicação simula o gerenciamento de **Empresas** e **Fornecedores**, respeitando regras de negócio específicas e validações importantes.

O sistema permite o cadastro, edição, listagem e exclusão de empresas e fornecedores, além do relacionamento entre eles, garantindo consistência dos dados e validações no front-end e no back-end.

---

## Demonstração da execução

https://github.com/user-attachments/assets/4f7e27ef-2718-4637-9ddb-7d2d86eceb58

---

## 🧩 Requisitos do Desafio

### Entidades Base

**Empresa**

* CNPJ
* Nome Fantasia
* CEP

**Fornecedor**

* CNPJ ou CPF
* Nome
* E-mail
* CEP
* RG (obrigatório para pessoa física)
* Data de nascimento (obrigatório para pessoa física)

### Regras de Negócio

* CRUD completo de todas as entidades (Front-end e Back-end)
* Uma empresa pode ter mais de um fornecedor
* Um fornecedor pode trabalhar para mais de uma empresa
* CNPJ e CPF devem ser únicos
* Fornecedores pessoa física devem possuir RG e data de nascimento
* Caso a empresa seja do **Paraná (PR)**, não é permitido vincular fornecedor pessoa física **menor de idade**
* Listagem de fornecedores com filtros por **Nome** e **CPF/CNPJ**
* Validação de CEP no Back-end e no Front-end

---

## 🛠️ Tecnologias Utilizadas

### Back-end

* **.Net**
* **C#**
* **Banco de Dados SQL Server**
* **API REST**

### Front-end

* **Angular**
* **TypeScript**
* **Angular Material**
  
---

## 🌐 Validação de CEP

Inicialmente, a validação de CEP seria feita utilizando a API:

```
http://cep.la/api
```

Entretanto, devido a indisponibilidade durante o desenvolvimento, foi utilizada a API do:

```
https://viacep.com.br
```
---

## ▶️ Como Executar o Projeto

### Pré-requisitos

* .NET SDK instalado (versão mais recente)
* Node.js instalado
* Angular CLI instalada
* Banco de dados configurado

### Back-end

```bash
# Acessar a pasta do backend
cd backend

# Restaurar pacotes e dependências
dotnet restore

# Executar as migrations
dotnet ef database update

# Iniciar o servidor
dotnet run
```

### Front-end

```bash
# Acessar a pasta do frontend
cd frontend

# Instalar as dependências
npm install

# Iniciar a aplicação
ng serve
```
A aplicação estará disponível em:

```
http://localhost:4200
```

