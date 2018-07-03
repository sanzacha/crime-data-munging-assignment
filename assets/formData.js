console.time('Data Munging');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const csvData = fs.createReadStream('./Crimes_-_2001_to_present.csv');
const updateFile = path.join(__dirname, './add-sample-data.json');

const rl = readline.createInterface({
    input: csvData,
    output: updateFile
});

let isHeader = true;
let header = [];
let year, primaryType, description;
let finalData = {};

rl.on('line', (line) => {
    // console.log(line);
    if(isHeader) {
        isHeader = false;
        header = line.split(',');
        year = header.indexOf('Year');
        primaryType = header.indexOf('Primary Type');
        description = header.indexOf('Description');
        // console.log(header);
    } else {
        const row = line.split(',');
        let obj = {};

        if (row[primaryType] === 'THEFT' && row[year] >= '2001' && row[year] <= '2018') {
            if (row[description] === 'OVER $500') {
                if (finalData[row[year]]) {
                    finalData[row[year]]['theftOver500']++
                } else {
                    obj['theftOver500'] = 1;
                    obj['theftUnder500'] = 0;
                    finalData[row[year]] = obj;
                } 
            } else if (row[description] === '$500 AND UNDER') {
                if (finalData[row[year]]) {
                    finalData[row[year]]['theftUnder500']++
                } else {
                    obj['theftOver500'] = 0;
                    obj['theftUnder500'] = 1;
                    finalData[row[year]] = obj;
                }
            }
        }
    }
    // console.log(finalData);
    // rl.pause(finalData);
});

rl.on('close', () => {
    console.log('Final Data::', finalData);
    fs.writeFile(updateFile, JSON.stringify(finalData), (err) => {
        console.log('file written');
        console.timeEnd('Data Munging');
    });
});







