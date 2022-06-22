const fs = require("fs");
const argv = require('yargs').argv;


const calcPercentageDiff = (without, withExtension) => {
    
  const per = ((without - withExtension ) / without) * 100 ;
  let result = Math.round(per * 100) / 100;
  let isPercentage = true;

  if (!without) {
    result = -withExtension
    isPercentage = false
  }
  return {
    result,
    isPercentage
  }
};

const printResult = (without, result, isPercentage, auditObj) => {
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

      console.log(logColor, `${without["audits"][auditObj].id}: ${log}`);  
}

const compareReports = (without, withExtension) => {
  console.log('compareReports');

  const metricFilter = Object.values(withExtension["audits"])
  .filter( (auditObj) => auditObj["numericValue"] && auditObj["numericUnit"] === "millisecond" )
  .map(({id}) => id)
  console.log(metricFilter)

  for (let auditObj in without["audits"]) {
    if (metricFilter.includes(auditObj)) {
      const { result, isPercentage } = calcPercentageDiff(
        without["audits"][auditObj].numericValue,
        withExtension["audits"][auditObj].numericValue
      );
      printResult(without, result, isPercentage, auditObj);            
    }
  }
  // console.log("\x1b[37m", '...');
};

const getContents = async pathStr => {
  console.log('getContents')
  const output = fs.readFileSync(pathStr, "utf8", (err, results) => {
      return results;
  });
  return JSON.parse(output);
};

const checkExists = async (pathStr1, pathStr2) => {
  console.log('checando')
  const file1Exists = fs.existsSync(pathStr1);
  console.log(`Existe ${pathStr1} ?`, file1Exists )
  const file2Exists = fs.existsSync(pathStr2);
  console.log(`Existe ${pathStr2} ?`, file2Exists )
  if (!file1Exists || !file2Exists){
    console.log('bloco duvidoso')
    setTimeout(() => checkExists(pathStr1, pathStr2), 3000)
  } else {
     const without = await getContents(pathStr1)
     const withExtension = await getContents(pathStr2)
     compareReports(without, withExtension)
     fs.unlinkSync(pathStr1);
     fs.unlinkSync(pathStr2);
  }
}

const exec = async () => {
  console.log('exec')
  await checkExists(argv.without, argv.withExtension);
}

exec();
