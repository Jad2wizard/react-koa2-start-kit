/**
 * Created by Jad_PC on 2018/1/25.
 */
const resolve = require('path').resolve;
const request = require('request-promise');
const tmpPath = resolve(__dirname, './res/tmp');
const hotUpdate = true;

const neo4jConfig = {
    username: 'neo4j',
    password: ' ',
    host: '127.0.0.1',
    port: 7474
};

module.exports = {
    port: 3000,
    hotUpdate,
    tmpPath,
    neo4jConfig
};