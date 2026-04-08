# Scalable Node.js API Boilerplate
![Node](https://img.shields.io/badge/node.js-18-green)
![TypeScript](https://img.shields.io/badge/typescript-5-blue)
![PostgreSQL](https://img.shields.io/badge/postgres-15-blue)
<br>

API base para construção de serviços Node.js escaláveis,
com arquitetura modular e infraestrutura pronta para produção.

## Como Rodar
1. Clonar o repositório
2. Instalar dependências
3. Configurar variáveis de ambiente
4. Rodar migrations
5. Iniciar o servidor

```
@desktop:~ git clone
@desktop:~ cd api-base
```

````
@desktop:~ npm install
@desktop:~ cp infra/.env.example infra/.env

````


````
@desktop:~ npm run migrate
@desktop:~ npm run dev
````

## Fluxo da aplicação:
````
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Database
````


## Tecnologias
- Node.js
- TypeScript
- PostgreSQL

## Funcionalidades
- Autenticação JWT
- Autorização baseado em RBAC 
- Refresh token rotation
- Rate limiting
- Multi-tenancy
- Error handling padronizado
- Arquitetura modular 




## Infraestrutura

```
src
 ├ core
 │  ├ BaseRepository
 │  └ httpErrors
 │  
 ├ infra
 │  ├ database
 │  ├ repositories
 |  └ middleware
 │
 └ modules
    └ users
       ├ controller
       ├ service
       └ repository
       ...
```
## Variaveis de Ambientes
> Devem ficar em @infra/.env 
````
MY_SECRET_KEY=  [chave da assinatura do payload do jwt]
DB_USER=        [usuario do banco de dados] 
DB_PASSWORD=    [senha do banco de dados]
DB_HOST=        [url do banco de dados | 'localhost'] 
DB_NAME=        [nome do banco de dados]
````

## Migrations
Qualquer mudança feita no schema deve ser criado um arquivo dentro de ``@infra/database/migrations`` no formato ``<sequencia>.<nome>.sql`` exemplo:

> 001_add_credits_column_on_users_table.sql

Em seguida basta rodar o comando ``npm run migrate`` que as mudanças serão feitas automaticamente

## FAQ

## Qual é o Proposito ? 
Esse projeto é uma API base, feita para acelerar o processo de desenvolvimento back-end <br> 
disponibilizando uma arquitetura pré configurada com:

- authentication
- error handling
- multi-tenancy
- rate limiting
- dependency injection

## Qual foi a Motivação ?
A maioria dos projetos back-end começa com reescrever a mesma infraestrutura:

- authentication
- error handling
- rate limiting
- database access

Esse projeto centraliza o problema em uma arquitetura base reutilizável 

## Como funciona a Arquitetura ?
O projeto segue uma arquitetura modular com três camadas:

- **core**      (Base do projeto: CRUDs e manipulação de Erros)
- **infra**     (Onde fica a segurança do projeto: agrupa middlewares, Database, manipulação de tokens e variaveis de ambientes)
- **modules**   (Regras de négocio: Services, Interfaces, Controllers baseados em entidades)
- **routes**    (Rotas e endpoints: Porta de acesso ao nosso back-end)
- **server**    (Express + Middlewares globais: Onde configuramos quem pode ou não acessar nossos serviços)
- **start**     (Start inicial da nossa aplicação: Contém API principal e API gateway caso precise de reverse-proxy)


## Porque Base Repository ?
Para evitar duplicação de código entre módulos.<br>
Um repositório base foi criado para centralizar CRUDs comuns na operação e reduzir duplicação de código entre os modules


## Porque Manipulação de Erros ?
A API usa uma classe HttpError centralizada para padronizar todos os response errors

### Beneficios:
- responses previsiveis
- fácil debugar 
- status code consistente 

## Como funciona a Segurança ?
A API inclui algumas camadas de segurança como:

- Middlewares de Autenticação | Autorização 
- Rate limiting por IP e user_id
- Validações de inputs usando zod 
- Middleware de multi-tenancy

## Porque a autenticação usa JWT + Refresh Token Rotation ?

### Motivo:
- Evitar roubo de refresh tokens
- Melhor controle de sessões


## Porque Multi-tenancy ?
Porque Multi-tenancy permite que uma única aplicação atenda múltiplos clientes
(tenants) utilizando a mesma infraestrutura.

Cada tenant possui seus dados isolados logicamente através do `tenant_id`.

Isso é comum em arquiteturas SaaS.

links de estudo: https://www.redhat.com/pt-br/topics/cloud-computing/what-is-multitenancy

## Arquitetura

````
                                  CLIENT (front-end)
                                    ||
                                    ||
                                  server (back-end)
                                    ||
                                    ||
Primary Database (write and read)   ┘└  Replicas (Read Only)
                                                ||
                                                ||
                                     Replica 1  ┘└  Replica 2
````

## Por que a aplicação usa tenant_id em todas as tabelas ?
O sistema suporta múltiplos tenants anexando tenant_id em todas as entidades <br> 
isso garante um isolamento lógico dos dados entre clientes

### Motivo:
- Isolamento de dados entre clientes.

## Existe Escalabilidade ?
Sim. A arquitetura permite escalamento horizontal.
Futuras melhorias podem incluir:

- Redis caching
- read replicas
- message queues

## Obrigado por ler até aqui! Sinta-se livre para refatorar e fazer PRs, vamos evoluir todos juntos! 
Ass: Davi Avelino