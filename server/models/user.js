/**
 * Created by Jad_PC on 2018/2/5.
 */
const neo4jDB = require('./initNeo4j');
const moment = require('moment');

neo4jDB.cypherQuery('call db.constraints', (err, res) => {
    if(err){
        console.log(err);
    } else {
        if(res.data && res.data.some(item => item.includes('name'))){
            return;
        } else {
            neo4jDB.cypherQuery('create constraint on (n:Person) assert n.name is unique', (err) => {
                if(err){
                    console.warn(err);
                }
            });
        }
    }
});

const add = (user) => new Promise((resolve, reject) => {
    if(!user.hasOwnProperty('password')){
        reject('缺少密码');
    }
    if(!user.hasOwnProperty('name')){
        reject('缺少用户名');
    }
    if(!user.hasOwnProperty('email')){
        reject('缺少邮箱地址');
    }

    console.log('bingo')
    const addUser = Object.assign({}, user, {role: 'member', isDelete: false, isLogged: false, createTime: moment().valueOf()});

    neo4jDB.cypherQuery(`create (n:Person {${Object.keys(addUser).map(k => k + ':"' + `${user[k]}`+'"').join(',')}}) return n;`, (err, node) => {
        if(err){
            if(err.message.includes('exists')){
                reject('用户名已经存在');
            } else {
                reject(err);
            }
        } else {
            resolve(node.data[0]);
        }
    })
});

const remove = (name) => new Promise((resolve, reject) => {
    neo4jDB.cypherQuery('match (n) where n.name = "' + `${name}` + '"delete n;', (err, res) => {
        if(err){
            reject(err);
        } else {
            resolve(res);
        }
    })
});

const fetch = (name) => new Promise((resolve, reject) => {
    neo4jDB.cypherQuery('match (n) where n.name = "' + `${name}` + `" return properties(n);`, (err, res) => {
        if(err){
            reject(err);
        } else {
            resolve(res.data[0]);
        }
    })
});

fetch('test').then(res => console.log(res)).catch(err => {
    console.warn(err);
})

module.exports = {
    add,
    remove,
    fetch
}
