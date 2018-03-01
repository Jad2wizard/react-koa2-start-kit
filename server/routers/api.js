/**
 * Created by Jad_PC on 2018/1/30.
 */
const apiRouters = require('koa-router')();
const {postRecordFile} = require('../controllers/api/voice');
const multer = require('koa-multer');
const moment = require('moment');
const config = require('./../../config');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.tmpPath);
    },
    filename: (req, file, cb) => {
        if(file){
            let filename = file.originalname.split('.')[0];
            let suffix = file.originalname.split('.')[1] || 'pcm';
            // let suffix = file.originalname.split('.')[1] || 'mp3';
            let timestamp = moment().valueOf();
            req.body.filename = `${filename}_${timestamp}.${suffix}`;
            req.body.originalname = file.originalname;
            cb(null, req.body.filename);
        }
    }
});
const fileUpload = multer({storage: fileStorage});

apiRouters.post('/record-file', fileUpload.single('file'), postRecordFile);

module.exports = apiRouters;