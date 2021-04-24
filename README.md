# Avadown-Bot
Um bot que verifica a estabilidade da conexão do ambiente virtual de aprendizagem utilizado no Instituto Federal do Espírito Santo

Em geral, acessa periodicamente o link especificado, analisando a o código de resposta http e com isso tuita sobre quedas e voltas

## Testes locais
Para testar o bot localmente é preciso possuir chaves de uma aplicação no twitter. [Ver mais](https://developer.twitter.com/)

**Passos:**
1. Baixe ou clone o repositório
2. Baixe as dependências com `npm install`
3. Crie um arquivo chamado `.env` seguindo o `.env-example`, com suas chaves do twitter
4. Inicie com `node index.js`

Para testar condições de erro, use o site [httpstat](https://httpstat.us/) substituindo o link com o erro correspondente no arquivo `index.js`

## Propondo alterações e modificações
Dependendo do acesso, faça um fork ou crie um branch para a modificação, quando pronto faça um pull request.

## Utilização em outros projetos
Este projeto está sob licença MIT, o que permite a utilização livremente. [Ver mais](https://github.com/mateuskrause/avadown-bot/blob/master/LICENSE)




