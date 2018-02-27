/**
 * Created by Jad_PC on 2018/1/30.
 */
const fs = require('fs');
const resolve = require('path').resolve;
const speechClient = require('baidu-aip-sdk').speech;
const shell = require('shelljs');
const config = require('./../../../config');
const {delay} = require('./../../utils/index');

const APP_ID = '10734020';
const API_KEY = 'yvy9HrLWztFteUBLQPL8unh4';
const SECRET_KEY = 'w0zd1Hl2wx2ZL3Bcp6BGmYTOGMALAGCd';
const client = new speechClient(APP_ID, API_KEY, SECRET_KEY);

const transcode = (objFile) => {
    const filename = objFile.split('.')[0];
    const cmd = `ffmpeg -v warning -i ${resolve(config.tmpPath, objFile)} -acodec pcm_s16le -f s16le -ac 1 -ar 16000 `+resolve(config.tmpPath, `${filename}.pcm`);
    shell.exec(cmd);
    return `${filename}.pcm`;
};

const recognize = (pcmFile) => {
    return new Promise((res, rej) => {
        try{
            // console.log(pcmFile)
            // console.log(resolve(config.tmpPath, pcmFile))
            const voice = fs.readFileSync(resolve(config.tmpPath, pcmFile));
            const vb = new Buffer(voice);
            client.recognize(vb, 'pcm', 16000).then(data => {
                res(data);
            }, err => {
                console.warn(err);
                rej(err);
            })
        } catch(err){
            console.warn(err);
            rej(err);
        }
    })
};

const postRecordFile = async (ctx) => {
    const filename = ctx.req.body.filename;
    const pcmFile = transcode(filename);
    await delay(1000);
    const voiceRes = await recognize(pcmFile);
    if(voiceRes['err_msg'].includes('success')){
        ctx.body = voiceRes.result;
    } else {
        console.log(voiceRes['err_msg']);
        ctx.throw(500);
    }
};

module.exports = {
    postRecordFile
};
