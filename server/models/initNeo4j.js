/**
 * Created by Jad_PC on 2018/1/31.
 */
const neo4j = require('node-neo4j');
const {neo4jConfig} = require('./../../config');

const neo4jDB = new neo4j(`http://${neo4jConfig.username}:${neo4jConfig.password}@${neo4jConfig.host}:${neo4jConfig.port}`);

module.exports = neo4jDB;