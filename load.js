#!/usr/bin/env node

const {execSync, exec} = require('child_process');
const { argv } = require('yargs');
let urls = require('./listOfUrls.json');

let runs = 0;
let runLimit = argv.times || 1; // Change this to be the number of performance tests you want to do
do {
    console.log(`Starting performance test ${runs + 1}`); // Logs this to the console just before it kicks off
    try {
      const urlsMaped = urls.map(({url}) => url);
      const urlsFiltered = urlsMaped.filter((urlObject, index) => urlsMaped.indexOf(urlObject) === index)
      
      console.log('urlsFiltered', urlsFiltered);

      if (!argv.url) {
        urlsFiltered.forEach(url => {
          execSync(`./index.js --url ${url}`, {stdio: 'inherit'});
        });
      }else {
        execSync(`./index.js --url ${argv.url}`, {stdio: 'inherit'});
      }
    }
    catch(err) {
        console.log(`Performance test ${runs + 1} failed`); // If Lighthouse happens to fail it'll log this to the console and log the error message
        break;
    }
    console.log(`Finished running performance test ${runs + 1}`); // Logs this to the console just after it finishes running each performance test
    runs++;
}
while (runs < runLimit); // Keeps looping around until this condition is false
console.log(`All finished`);