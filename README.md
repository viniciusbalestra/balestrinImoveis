# Balestrin Imóveis - Sistema de Gestão Imobiliária

## Descrição do Projeto

Este projeto é um sistema de gestão imobiliária **Full Stack** desenvolvido para a Balestrin Imóveis. Ele oferece uma plataforma robusta para gerenciar informações sobre imóveis, desde o cadastro e listagem até a visualização de detalhes e o upload de fotos.

O **backend** é construído com **Spring Boot (Java)**, utilizando JPA/Hibernate para persistência de dados em um banco de dados MySQL. A **interface de usuário (frontend)** é uma aplicação web interativa desenvolvida com **HTML, CSS e JavaScript puro**.

## Funcionalidades

As principais funcionalidades do sistema incluem:

* **Cadastro de Imóveis**: Permite cadastrar novos imóveis com detalhes como título, descrição, valor, metragem, número de quartos/banheiros/vagas, características adicionais, endereço completo e fotos.
* **Listagem de Imóveis**: Exibe listagens de imóveis disponíveis para investimento e venda, tanto na página inicial quanto em páginas dedicadas, com opções de filtragem e destaque.
* **Detalhes do Imóvel**: Permite visualizar informações detalhadas sobre um imóvel específico, incluindo múltiplas fotos, descrição completa e características.
* **Upload de Fotos**: Suporta o upload de múltiplas fotos para cada imóvel, com a capacidade de definir uma foto de capa para o imóvel. O gerenciamento de arquivos pode ser configurado para armazenamento local ou em serviços de nuvem (ex: AWS S3).
* **API RESTful**: O backend expõe uma API RESTful completa para acesso e manipulação dos dados dos imóveis, permitindo a comunicação eficiente com o frontend e outras aplicações.
* **Banco de Dados MySQL**: Todos os dados dos imóveis são armazenados e gerenciados em um banco de dados relacional MySQL.

## Tecnologias Utilizadas

### Backend (Java/Spring Boot)

* **Java 17+**: Linguagem de programação.
* **Spring Boot**: Framework para desenvolvimento rápido de APIs RESTful.
* **Spring Data JPA**: Para persistência de dados e interação com o banco de dados.
* **Hibernate**: Implementação de JPA.
* **MySQL Driver**: Para conexão com o banco de dados MySQL.
* **Lombok**: Para reduzir boilerplate code (getters, setters, construtores).
* **Jackson**: Para serialização/desserialização de JSON.
* **Spring Web**: Para construir a API RESTful.

### Frontend (HTML, CSS, JavaScript)

* **HTML5**: Estrutura das páginas web.
* **CSS3**: Estilização e layout.
* **JavaScript (ES6+)**: Lógica interativa do lado do cliente, manipulação do DOM e chamadas de API.
* **Fetch API**: Para comunicação assíncrona com o backend (requisições HTTP).

### Banco de Dados

* **MySQL**: Sistema de Gerenciamento de Banco de Dados Relacional.

## Estrutura do Projeto

O projeto é dividido em duas partes principais: `backend` (Spring Boot) e `frontend` (HTML/CSS/JS puro).

balestrin-imoveis/
├── backend/                  # Diretório do projeto Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/         # Código-fonte Java do backend
│   │   │   │   └── com/seuprojeto/
│   │   │   │       ├── BalestrinImoveisApplication.java # Classe principal
│   │   │   │       ├── controller/  # Controladores REST
│   │   │   │       ├── service/     # Camada de serviço/lógica de negócio
│   │   │   │       ├── repository/  # Interfaces Spring Data JPA
│   │   │   │       ├── model/       # Entidades JPA (Imovel, Endereco, Foto)
│   │   │   │       └── dto/         # Objetos de Transferência de Dados (ImovelDTO, EnderecoDTO)
│   │   │   └── resources/    # Recursos do Spring Boot (application.properties, etc.)
│   │   │       ├── application.properties # Configurações do DB, servidor, etc.
│   │   │       └── static/   # Recursos estáticos (opcional, se servir frontend pelo Spring)
│   ├── pom.xml               # Arquivo de configuração do Maven
│   └── .env.example          # Exemplo de variáveis de ambiente do backend
├── frontend/                 # Diretório da aplicação frontend
│   ├── index.html            # Página inicial
│   ├── pages/                # Outras páginas HTML (contato.html, investimentos.html, cadastro.html)
│   │   └── cadastro.html
│   ├── scripts/              # Arquivos JavaScript
│   │   ├── cadastro.js
│   │   └── headerFooterLoader.js
│   │   └── engine.js
│   ├── styles/               # Arquivos CSS
│   │   └── style.css
│   ├── assets/               # Imagens, ícones, etc.
│   └── favicon/
└── README.md                 # Este arquivo

## Configuração e Execução

### Pré-requisitos

* JDK (Java Development Kit) 17 ou superior
* Apache Maven (gerenciador de dependências Java)
* MySQL Server
* Um editor de código (IntelliJ IDEA, VS Code, Eclipse)
* Node.js e npm (para o Live Server do frontend, se usado)

### Configuração do Banco de Dados

1.  Crie um banco de dados MySQL (ex: `balestrin_imoveis_db`).
2.  Configure as credenciais do banco de dados no arquivo `backend/src/main/resources/application.properties` (ou `.env` se estiver usando uma biblioteca para isso), por exemplo:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/balestrin_imoveis_db?useSSL=false&serverTimezone=UTC
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    spring.jpa.hibernate.ddl-auto=update # Ou create para criar tabelas na primeira execução
    spring.jpa.show-sql=true
    ```

### Executando o Backend

1.  Navegue até o diretório `backend/`.
2.  Construa o projeto Maven:
    ```bash
    mvn clean install
    ```
3.  Execute a aplicação Spring Boot:
    ```bash
    mvn spring-boot:run
    ```
    O backend estará acessível geralmente em `http://localhost:8080`.

### Executando o Frontend

1.  Navegue até o diretório `frontend/`.
2.  Você pode usar uma extensão como "Live Server" no VS Code ou simplesmente abrir os arquivos HTML diretamente no navegador. Para desenvolvimento, Live Server é recomendado para recarregamento automático.
    * Se estiver usando Live Server, inicie-o na pasta `frontend/`. O frontend estará acessível geralmente em `http://127.0.0.1:5501` (ou outra porta definida).
3.  Garanta que as chamadas da API no seu JavaScript (`BASE_URL_BACKEND`) apontam para o endereço correto do seu backend (ex: `http://localhost:8080/api`).

## Rotas da API (Backend)

As principais rotas expostas pelo backend incluem:

* **`POST /api/cadastro`**: Cadastra um novo imóvel no sistema.
* **`GET /api/imoveis`**: Retorna todos os imóveis cadastrados.
* **`GET /api/imoveis/{id}`**: Retorna os detalhes de um imóvel específico pelo ID.
* **`GET /api/imoveis/categoria/{categoria}`**: Retorna imóveis filtrados por categoria.
* **`GET /api/imoveis/categoria/{categoria}/destaques`**: Retorna imóveis em destaque por categoria.
* **`POST /api/fotos/upload/{imovelId}`**: Realiza o upload de fotos para um imóvel específico. (Requisições `multipart/form-data`)
* **`PATCH /api/imoveis/{id}/fotos`**: Atualiza as chaves das fotos no imóvel após o upload (se o upload retornar chaves/URLs).
* **`PUT /api/imoveis/{id}`**: Atualiza os dados de um imóvel existente.
* **`DELETE /api/imoveis/{id}`**: Remove um imóvel do sistema.

**(Nota: Ajuste as rotas acima para refletir exatamente o que você implementou ou pretende implementar no seu `ImovelController`.)**

## Banco de Dados

O projeto utiliza um banco de dados MySQL. As configurações de conexão são gerenciadas pelo Spring Boot através do arquivo `application.properties`. As tabelas são criadas/atualizadas automaticamente pelo Hibernate com base nas suas entidades JPA (`ddl-auto=update`).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, enviar pull requests ou sugerir melhorias.
