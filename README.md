# Balestrin Imóveis - Sistema de Gestão Imobiliária

## Descrição do Projeto

Este projeto é um sistema de gestão imobiliária desenvolvido para a Balestrin Imóveis. Ele fornece uma plataforma para gerenciar informações sobre imóveis, incluindo cadastro, listagem, detalhes e upload de fotos. O sistema foi construído utilizando Node.js, Express e MySQL, com uma interface de usuário interativa.

## Funcionalidades

As principais funcionalidades do sistema incluem:

* **Cadastro de Imóveis:** Permite cadastrar novos imóveis no sistema, incluindo detalhes como título, descrição, localização, características e fotos.

* **Listagem de Imóveis:** Exibe listagens de imóveis disponíveis para investimento e venda, tanto na página inicial quanto em páginas dedicadas.

* **Detalhes do Imóvel:** Permite visualizar informações detalhadas sobre um imóvel específico, incluindo fotos, descrição e características.

* **Upload de Fotos:** Permite fazer upload de múltiplas fotos para cada imóvel, incluindo a definição de uma foto de capa.

* **API RESTful:** O sistema possui uma API RESTful para acessar e manipular os dados dos imóveis.

* **Banco de Dados MySQL:** Os dados dos imóveis são armazenados em um banco de dados MySQL.

* **Arquivo JSON:** Os dados dos imóveis também são armazenados em um arquivo JSON para fins de sincronização e backup.

## Tecnologias Utilizadas

* Node.js
* Express
* MySQL
* Multer (para upload de arquivos)
* CORS
* dotenv
* fs
* path

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

    balestrin-imoveis/
    ├── app.js             # Arquivo principal do Express
    ├── server.js          # Arquivo para iniciar o servidor
    ├── routes/          # Diretório para arquivos de rotas
    │   └── imoveis.routes.js
    ├── controllers/     # Diretório para arquivos de controladores
    │   └── imoveis.controller.js
    ├── middleware/      # Diretório para arquivos de middleware
    │   └── error.middleware.js
    ├── queries.js         # Arquivo para consultas ao banco de dados
    ├── connection.js      # Arquivo para conexão com o banco de dados
    ├── upload.js          # Arquivo para configuração do Multer (upload de arquivos)
    ├── src/             # Diretório para arquivos estáticos
    │   ├── scripts/     # Scripts da aplicação
    │   │   └── engine.js
    │   │   └── headerFooterLoader.js
    ├── styles/      # Estilos CSS
    │   └── style.css
    ├── assets/      # Recursos (imagens, etc.)
    │   └── favicon/
    ├── pages/           # Páginas HTML
    │   ├── investimentos.html
    │   ├── contato.html
    ├── allImoveis.json    # Arquivo JSON com dados dos imóveis
    ├── package.json
    └── README.md        # Este arquivo

## Rotas da API

A API possui as seguintes rotas:

* `GET /api/imoveis/:categoria`: Retorna os imóveis de uma determinada categoria.

* `GET /api/imoveis/:categoria/destaques`: Retorna os imóveis em destaque de uma determinada categoria.

* `GET /imoveis`: Retorna todos os imóveis do banco de dados.

* `POST /sincronizar-imoveis`: Sincroniza os dados do arquivo JSON com o banco de dados.

* `POST /upload`: Recebe o upload de fotos de um imóvel.

## Banco de Dados

O projeto utiliza um banco de dados MySQL. A configuração do banco de dados é feita através das variáveis de ambiente no arquivo `.env`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.
