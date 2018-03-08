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
        reject({message: '缺少密码'});
        return;
    }
    if(!user.hasOwnProperty('name')){
        reject({message: '缺少用户名'});
        return;
    }
    if(!user.hasOwnProperty('email')){
        reject({message: '缺少邮箱地址'});
        return;
    }

    const addUser = Object.assign({}, {role: 'member', isDelete: false, isLogged: false, createTime: moment().valueOf(), lastLogTime: moment().valueOf()}, user);
    console.log(addUser)
    const addStr = Object.keys(addUser).map(k => {
        const val = addUser[k];
        return (typeof  val !== 'boolean') ? k + ':"' + `${val}`+'"' : k + `:${val}`;
    }).join(',');
    neo4jDB.cypherQuery(`create (n:Person {${addStr}}) return n;`, (err, node) => {
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

const update = (user) => new Promise((resolve, reject) => {
    const name = user.name;
    if(!name){
        reject('更新用户数据时缺少用户名');
    }
    delete user.name;
    const updateStr = Object.keys(user).map(key => {
        const val = user[key];
        return (typeof val !== 'boolean') ? `n.${key} = "` + `${user[key]}"` : `n.${key} = ${val}`;
    }).join(',');
    neo4jDB.cypherQuery('match (n {name: "' + name + `" }) set ${updateStr} return properties(n);`, (err, res) => {
        if(err){
            reject(err);
        } else {
            resolve(res.data[0]);
        }
    });
});

module.exports = {
    add,
    remove,
    fetch,
    update
}
