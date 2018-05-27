'use-strict';

let getIni = require('./get-ini');

module.exports = function config() {
    return {
        cssAssets: getIni('assets').css || [],
        jsAssets: getIni('assets').js || [],
        directories: getIni('directories') || {},
        minifier: getIni('minifier') || {},
        pug: getIni('pug') || {},
        hash: getIni('hash') || {}
    };
};
