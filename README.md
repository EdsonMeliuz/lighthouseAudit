# lighthouseAudit
Este repositório tem por objetivo gerar insights na comparação de desempenho de sites com a extensão ativa.

Inicialmente é possível obter dados de desempenho, quase que simultaneamente de uma aplicação web com extensão e sem  extensão.

## Para próximas atividades temos que:

- [x] Filtrar dados relevantes de modo que gerem informações precisas para as pŕoximaas ações em mitigar a falta de desempenho
- [x] Criar uma lógia de comparação e a estrutura para instrumentação desta informações
- [x] Salvar essa estrutura em um banco de dados(Big Query)
- [x] Analisar estes dados
- [ ] Agir corretivamente

## Setup

- Clonar repositório:
  - `git clone git@github.com:EdsonMeliuz/lighthouseAudit.git`
  
- Instalar dependências
  - `npm install`
  
- Permitir script
  - `chmod a+x ./load.js`
  
- Adicionar versão da extensão a ser testada:
  - No diretório do [repositório lembrador](https://github.com/meliuz/lembrador-extensions)
    - Escolher a branch e o commit que tenha a versão da extensão que se deseja testar.
    - Seguir o setup do repositório em questão rodando por fim `make dev` ou `make build`;
  - No diretório do [repositório lighthouseAudit](https://github.com/EdsonMeliuz/lighthouseAudit)
    - Comentar a linha 37 do arquivo `index.js` (`await compareReport();`)
    - Comentar a linha 55 do arquivo `getReport.js` (`await chrome.kill()`)
  - Realizar uma comparação qualquer
    - `./load.js --url sp.booking.com --extensionVersion 8.1.2`
    - Vão abrir duas janelas de chrome:
      - Na janela que já possui a extensão instalada, atualizar a extensão de acordo com o setup do [repositório lembrador](https://github.com/meliuz/lembrador-extensions) ("Carregar sem compactação").
  - Descomentar as linhas.  

- Scripts
  - O seguinte script irá rodar a comparação para todas as urls da lista de urls
    - `./load.js --extensionVersion <Versão da extensão>` 
  - Para rodar mais de uma comparação basta utilizar o argumento `--times`
    - `./load.js --extensionVersion <Versão da extensão> --times <Vezes que deseja rodar o teste>`
  - Para testar uma url específica utilizar o argumento `--url`
    - `./load.js --extensionVersion <Versão da extensão> --url <url desejada(deve estar no listOfUrls.json)>`
 
 Obs: É necessário colocar a versão da extensão para associar aos dados que serão salvos no BQ



