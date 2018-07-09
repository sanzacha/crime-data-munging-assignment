var readCsvFile = function readCsvFile() {
    console.time('Data Munging');
    const fs = require('fs');
    const readline = require('readline');
    const path = require('path');

    const csvData = fs.createReadStream('./Crimes_-_2001_to_present.csv');
    const updateFile = path.join(__dirname, './assault.json');

    const rl = readline.createInterface({
        input: csvData,
        output: updateFile
    });

    let isHeader = true;
    let header = [];
    let year, primaryType, description, arrest;
    let jsonAssaultData = {};

    rl.on('line', (line) => {
        constructAssualtJson(line);
    });

    rl.on('close', () => {
        writeAssualtData();
    });

    function constructAssualtJson (line) {
        if(isHeader) {
            header = line.split(',');
            year = header.indexOf('Year');
            primaryType = header.indexOf('Primary Type');
            description = header.indexOf('Description');
            arrest = header.indexOf('Arrest');
            isHeader = false;
        } else {
            const row = line.split(',');
            let obj = {};
            let objAssualtArrest = {};
    
            if ((row[year] >= 2001 && row[year] <= 2018) && row[primaryType] === 'ASSAULT') {
                if (row[arrest] === 'true') {
                    if (jsonAssaultData[row[year]]) {
                        jsonAssaultData[row[year]].arrestTrue++;
                    } else {
                        objAssualtArrest.arrestTrue = 1;
                        objAssualtArrest.arrestFalse = 0;
                        jsonAssaultData[row[year]] = objAssualtArrest;
                    }
                } else if (row[arrest] === 'false') {
                    if (jsonAssaultData[row[year]]) {
                        jsonAssaultData[row[year]].arrestFalse++;
                    } else {
                        objAssualtArrest.arrestFalse = 1;
                        objAssualtArrest.arrestTrue = 0;
                        jsonAssaultData[row[year]] = objAssualtArrest;
                    }
                }
            }
        }
        // console.log(jsonAssaultData);
        // rl.pause(finalData);
    }

    function writeAssualtData() {
        console.log('Final Data::', jsonAssaultData);
        fs.writeFile(updateFile, JSON.stringify(jsonAssaultData), (err) => {
            console.log('file written');
            console.timeEnd('Data Munging');
        });
    }
}

readCsvFile();