#!/usr/bin/env node

const execSync = require('child_process').exec;
let urls = require('./listOfUrls.json'); // O arquivo onde sua lista de urls reside 
let runs = 0;
urls.forEach(({url, dir}) => {
  console.log(`Executando teste de desempenho ${runs + 1}`); // Registra isso no console antes de iniciar
  try { 
    execSync(`node index.js --url ${url} --dir ${dir}`); // Executa isso na linha de comando para executar o teste de desempenho 
  }
  catch(err) { 
    console.log(`Teste de desempenho ${runs + 1} failed`); // Se o Lighthouse falhar, ele registrará isso no console e registrará a mensagem de erro 
  }

  console.log(`Finished running performance test ${runs + 1}`); // Registra isso no console logo após concluir a execução de cada teste de desempenho
  runs++;

});

console.log(`Tudo finalizado`);