const fs = require("fs");
const argv = require('yargs').argv;

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

const compareReports = (without, withExtension) => {
  console.log('compareReports');

  const metricFilter = Object.values(withExtension["audits"])
  .filter( (auditObj) => auditObj["numericValue"] && auditObj["numericUnit"] === "millisecond" )
  .map(({id}) => id)
  console.log(metricFilter)

  const calcPercentageDiff = (without, withExtension) => {
    // let result
    // let unit
    
    const per = ((without - withExtension ) / without) ;
    result = Math.round(per * 100) / 100;
    // unit = 'percentageRate'

    if (!without) {
      result = -withExtension
      // unit = 'ms'
    }
    // return {
    //   result,
    //   unit
    // }
    return result
  };

  for (let auditObj in without["audits"]) {
    if (metricFilter.includes(auditObj)) {
      const percentageDiff = calcPercentageDiff(
        without["audits"][auditObj].numericValue,
        withExtension["audits"][auditObj].numericValue
      );

      let logColor = "\x1b[37m";
      const log = (() => {
        if (Math.sign(percentageDiff) === -1) {
          logColor = "\x1b[31m";          
          return percentageDiff;          
        } else if (Math.sign(percentageDiff) === 0) {
          return "unchanged";
        } else {
          logColor = "\x1b[32m";
          return percentageDiff;
        }        
      })();

      console.log(logColor, `${without["audits"][auditObj].id}: ${log}`);      
    }
  }
  console.log("\x1b[37m", '...');
};

const exec = async () => {
  console.log('exec')
  await checkExists(argv.without, argv.withExtension);
}

exec();
