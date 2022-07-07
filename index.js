#!/usr/bin/env node

const {execSync, exec, spawn} = require('child_process');
let urls = require('./listOfUrls.json'); // O arquivo onde sua lista de urls reside 
const argv = require('yargs').argv;

const getReport = async() => {
  urls
  .filter(({url}) => url.includes(argv.url))
  .forEach(({url, dir}) => {
    try { 
      const reportProcess = exec(`node getReport.js --url ${url} --dir ${dir}`);

      reportProcess.stdout.on('data', function(data) {
        console.log(data); 
      })
    }
    catch(err) { 
      console.log(`Teste de desempenho failed`); 
    }
  });
}

const compareReport = async () => {
  const urlsFiltered = urls.filter(({path}) => path.includes(argv.url.replace("https://www.", "")))
  try { 
    execSync(`node compareReports.js --without ${urlsFiltered[0].path} --withExtension ${urlsFiltered[1].path} --url ${urlsFiltered[0].url} --extensionVersion ${argv.extensionVersion}`, {stdio: 'inherit'});

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