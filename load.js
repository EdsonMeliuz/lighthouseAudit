#!/usr/bin/env node

const {execSync, exec} = require('child_process');
const { argv } = require('yargs');
let urls = require('./listOfUrls.json');

const regex = new RegExp('^[0-9]{1,2}(\.[0-9]{1,2}\){2}$');
if(!argv.extensionVersion || !regex.test(argv.extensionVersion)) {
  console.log('Favor entrar com um formato válido para a versão da extensão (--extensionVersion <x.x.x>)')
  return
}

let runs = 0;
let runLimit = argv.times || 1; 
do {
    console.log(`Starting performance test ${runs + 1}`); 
    try {
      const urlsMaped = urls.map(({url}) => url);
      const urlsFiltered = urlsMaped.filter((urlObject, index) => urlsMaped.indexOf(urlObject) === index)

      if (!argv.url) {
        urlsFiltered.forEach(url => {
          execSync(`./index.js --url ${url} --extensionVersion ${argv.extensionVersion}`, {stdio: 'inherit'});
        });
      }else {
        execSync(`./index.js --url ${argv.url} --extensionVersion ${argv.extensionVersion}`, {stdio: 'inherit'});
      }
    }
    catch(err) {
        console.log(`Performance test ${runs + 1} failed`);
        break;
    }
    console.log(`Finished running performance test ${runs + 1}`); 
    runs++;
}
while (runs < runLimit); 
console.log(`All finished`);