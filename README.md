# nextlevelweek2020
## REQUISITOS ##
- node

npm init -y
cria um projeto padrão em node

npm install express
cuida das rotas

npm install @types/express -D

instalar o type script
npm install typescript -D

criar arquivo de configuração do type script
npx tsc --init

node arquivo.ts -> isso não funciona pois o node entende apenas arquivo javascript e o arquivo é type script

para rodar o servidor node com type script
npm install ts-node -D

npx serve para executar um pacote node que foi instalado
npx ts-node src/arquivo.ts

agora é só abrir o browser e acessar a rota na porta informada: localhost:3333/users

para não ficar finalizando o servidor a cada mudança para depuração, instalar o ts-node-dev
npm install ts-node-dev -D

para rodar com watch
npx ts-node-dev src/server.ts

para não ficar rodando "npx ts-node-dev src/file.ts" toda hora, editar o package.json e adicionar um script para facilitar a vida

  "scripts": {
    "dev": "npx ts-node-dev src/server.ts"
  },
para executar, rode
npm run dev

## REACT ##
para criar o projeto react, usar o npx para executar um pacote do node
npx create-react-app web --template=typescript

web=diretorio
--template=typescript

executando o projeto react
npm start

## REACT NATIVE ##
interpreta o código java script e executa como nativo usando um engine interno que vai junto com a aplicação.

para execução do projeto sem necessidade de instalação de outras aplicações android studio e xcode, será utilizado o expo
o expo vai disponibilizar os acessos básciso de um device e executará o código.

