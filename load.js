#!/usr/bin/env node

const {execSync, exec, spawn} = require('child_process');
let urls = require('./listOfUrls.json'); // O arquivo onde sua lista de urls reside 


const getReport = async() => {
  let runs = 0;
  urls.forEach(({url, dir}) => {
    console.log(`Executando teste de desempenho ${runs + 1}`); // Registra isso no console antes de iniciar
    try { 
      const reportProcess = exec(`node index.js --url ${url} --dir ${dir}`); // Executa isso na linha de comando para executar o teste de desempenho 

      reportProcess.stdout.on('data', function(data) {
        console.log(data); 
      })
    }
    catch(err) { 
      console.log(`Teste de desempenho ${runs + 1} failed`); // Se o Lighthouse falhar, ele registrará isso no console e registrará a mensagem de erro 
    }

    console.log(`Finished running performance test ${runs + 1}`); // Registra isso no console logo após concluir a execução de cada teste de desempenho
    runs++;
  });
}

const compareReport = async () => {
  console.log(urls[0].path, urls[1].path)
  try { 
    console.log('bloco try')
    const compareProcess = exec(`node compareReports.js --without ${urls[0].path} --withExtension ${urls[1].path}`);
    
    compareProcess.stdout.on('data', function(data) {
      console.log(data); 
    })

  }
  catch(err) { 
    console.log(`Comparação failed`);
  }
}

const init = async() => {
  await getReport();
  await compareReport();
}

init();