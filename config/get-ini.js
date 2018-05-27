'use-strict';

let fs = require('fs');
let ini = require('ini');

module.exports = function getIni(iniFile) {
    let parsedFile;

    function parseIni(path) {
        return ini.parse(fs.readFileSync(__dirname + path, 'utf-8'));
    }

    try {
        iniFile = '/' + iniFile + '.ini';
        parsedFile = parseIni(iniFile);
    }
    catch(err) {
        console.error('Can\'t open INI file ' + iniFile);
    }
    finally {
        return parsedFile;
    }
};
