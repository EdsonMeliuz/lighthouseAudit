const fs = require("fs");
const argv = require('yargs').argv;
const axios = require('axios');
const CLOUD_TRIGGER = 'https://us-central1-lembrador-development-2c7f9.cloudfunctions.net/lighthouseComparisonToBQ'

const printResult = (id, result, isPercentage) => {
  let logColor = "\x1b[37m";
      const log = (() => {
        if (Math.sign(result) === -1) {
          logColor = "\x1b[31m";
        }
        if (Math.sign(result) === 1){
          logColor = "\x1b[32m";
        } 
        return isPercentage ? `${result} %` : `${result} ms`;       
      })();

      console.log(logColor, `${id}: ${log}`);  
}

const calcPercentageDiff = (without, withExtension) => {
  let result
  let isPercentage = false

  if (!without) {
    result = -withExtension
  } else if (!withExtension){
    result = without
  } else {
    const per = ((without - withExtension ) / without) * 100 ;
    result = Math.round(per * 100) / 100;
    isPercentage = true;
  }
  return {
    result,
    isPercentage
  }
};

const compareReports = (without, withExtension) => {

  const metrics = Object.values(withExtension["audits"])
  .filter( (auditObj) => auditObj["numericValue"] && auditObj["numericUnit"] === "millisecond" )
  .map(({id, numericValue}) => {
    const struturedResults = {
      id,
      ...calcPercentageDiff(
        Object.values(without["audits"]).find((withoutAuditObj) => withoutAuditObj.id === id )["numericValue"],
        numericValue),
    }
    const {result, isPercentage} = struturedResults;
    printResult(id, result, isPercentage);
    return struturedResults
  })
  console.log("\x1b[37m", '...');

  return metrics
};

const getContents = async pathStr => {
  const output = fs.readFileSync(pathStr, "utf8", (err, results) => {
      return results;
  });
  return JSON.parse(output);
};

const structureData = (metrics) => {
  return {
    extensionVersion: argv.extensionVersion,
    url: argv.url,
    metrics
  }
}

const postData = async (data) => {
  try {
    const response = await axios.post(CLOUD_TRIGGER, data);
    console.log(response)
  } catch (error) {
    console.log(error, "informações não conseguiram ser registradas");
  }
}

const checkExists = async (pathStr1, pathStr2) => {
  console.log('checando')
  const file1Exists = fs.existsSync(pathStr1);
  console.log(`Existe ${pathStr1} ?`, file1Exists )
  const file2Exists = fs.existsSync(pathStr2);
  console.log(`Existe ${pathStr2} ?`, file2Exists )
  if (!file1Exists || !file2Exists){
    setTimeout(() => checkExists(pathStr1, pathStr2), 3000)
  } else {
     const without = await getContents(pathStr1)
     const withExtension = await getContents(pathStr2)
     const metrics = compareReports(without, withExtension)
    //  postData(structureData(metrics));
    //  fs.unlinkSync(pathStr1);
    //  fs.unlinkSync(pathStr2);
  }
}

const exec = async () => {
  await checkExists(argv.without, argv.withExtension);
}

exec();
