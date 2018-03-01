/**
 * Created by Jad_PC on 2018/1/30.
 */
const fs = require('fs');
const resolve = require('path').resolve;
const speechClient = require('baidu-aip-sdk').speech;
const shell = require('shelljs');
const config = require('../../../../config');
const {APP_ID, API_KEY, SECRET_KEY} = require('./config');

const client = new speechClient(APP_ID, API_KEY, SECRET_KEY);
const transcode = async (objFile) => {
    const filename = objFile.split('.')[0];
    const cmd = `ffmpeg -v warning -i ${resolve(config.tmpPath, objFile)} -acodec pcm_s16le -f s16le -ac 1 -ar 8000 -y `+resolve(config.tmpPath, `${filename}.pcm`);
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
            client.recognize(vb, 'pcm', 8000).then(data => {
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
    const pcmFile = await transcode(filename);
    // await delay(1000);
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
