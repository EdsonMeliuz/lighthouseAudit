// Main lighthouse runner / fn
const lighthouse = require('lighthouse');

// Required for launching chrome instance
const chromeLauncher = require('chrome-launcher');

// So we can save output
const fs = require("fs");

const argv = require('yargs').argv;

const diagnostic = async (url, profile) => {
    // Launch instance of Chrome
    const newFlags = chromeLauncher.Launcher.defaultFlags().filter(flag => flag !== '--disable-extensions');
    const chrome = await chromeLauncher.launch({
      ignoreDefaultFlags: true,
      chromeFlags: newFlags,
      userDataDir: profile,
    });

    // Gather results and report from Lighthouse
    const results = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
    }, {
        extends: 'lighthouse:default',
        settings: {
            onlyCategories: ['performance'],
        }
    });

    // Save report to fil
    const urlObj = new URL(url);
    let dirName = urlObj.host.replace("www.", "");
    if (urlObj.pathname !== "/") {
      dirName = dirName + urlObj.pathname.replace(/\//g, "_");
    }
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }

    await fs.writeFile(
      `./${dirName}/lighthouse-${profile}-report.json`,
      results.report,
      err => {
        if (err) throw err;
      });

    // Kill Chrome
    await chrome.kill();
    
};

diagnostic(argv.url, argv.dir)