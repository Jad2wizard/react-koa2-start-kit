/**
 * Created by Jad_PC on 2018/1/30.
 */
const MediaUtils = {
    /**
     * 获取用户媒体设备(处理兼容的问题)
     * @param videoEnable {boolean} - 是否启用摄像头
     * @param audioEnable {boolean} - 是否启用麦克风
     * @param callback {Function} - 处理回调
     */
    getUserMedia: (videoEnable, audioEnable, callback) => {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
            || navigator.msGetUserMedia || window.getUserMedia;
        const constraints = {video: videoEnable, audio: audioEnable};
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                callback(false, stream);
            })['catch'](function(err) {
                callback(err);
            });
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, stream => {
                callback(false, stream);
            }, err => {
                callback(err);
            });
        } else {
            callback(new Error('Not support userMedia'));
        }
    },

    /**
     * 关闭媒体流
     * @param stream {MediaStream} - 需要关闭的流
     */
    closeStream: stream => {
        if (typeof stream.stop === 'function') {
            stream.stop();
        }
        else {
            let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

            for (let i = 0; i < trackList.length; i++) {
                let tracks = trackList[i];
                if (tracks && tracks.length > 0) {
                    for (let j = 0; j < tracks.length; j++) {
                        let track = tracks[j];
                        if (typeof track.stop === 'function') {
                            track.stop();
                        }
                    }
                }
            }
        }
    }
};

// 用于存放 MediaRecorder 对象和音频Track，关闭录制和关闭媒体设备需要用到
let recorder, mediaStream;

// 用于存放录制后的音频文件对象和录制结束回调
let recorderFile, stopRecordCallback;

// 用于存放是否开启了视频录制
let videoEnabled = false;

// 录制短语音
export const startRecord = enableVideo => {
    videoEnabled = enableVideo;
    MediaUtils.getUserMedia(enableVideo, true, (err, stream) => {
        if (err) {
            throw err;
        } else {
            // 通过 MediaRecorder 记录获取到的媒体流
            recorder = new MediaRecorder(stream);
            mediaStream = stream;
            let chunks = [];
            recorder.ondataavailable = function(e) {
                chunks.push(e.data);
            };
            recorder.onstop = () => {
                recorderFile = new Blob(chunks, { 'type' : recorder.mimeType });
                chunks = [];
                if (null != stopRecordCallback) {
                    stopRecordCallback();
                }
            };
            recorder.start();
        }
    });
};

// 停止录制
const stopRecord = (callback) => {
    stopRecordCallback = callback;
    // 终止录制器
    recorder.stop();
    // 关闭媒体流
    MediaUtils.closeStream(mediaStream);
};

// 播放录制的音频
export const playRecord = () => {
    let url = URL.createObjectURL(recorderFile);
    let dom = document.createElement(videoEnabled ? 'video' : 'audio');
    dom.autoplay = true;
    dom.src = url;
    if (videoEnabled) {
        dom.width = 640;
        dom.height = 480;
        dom.style.zIndex = '9999999';
        dom.style.position = 'fixed';
        dom.style.left = '0';
        dom.style.right = '0';
        dom.style.top = '0';
        dom.style.bottom = '0';
        dom.style.margin = 'auto';
        document.body.appendChild(dom);
    }
};

const sendRecordFile = () => {
    const formData = new FormData();
    const options = {
        method: 'post'
    };
    formData.append('file', recorderFile);
    options.body = formData;
    fetch('http://127.0.0.1:3000/api/record-file', options).then(res => res.json()).then(res => {
        console.log(res);
        res = res[0] || '';
        if(res.includes('测试一')){
            window.store.dispatch(window.routerActions.push('/test1'));
        }else if(res.includes('测试二')){
            window.store.dispatch(window.routerActions.push('/test2'));
        }
    });
};

export const startVoiceRecord = () => {
    startRecord(false);
};

export const stopAndSendRecord = () => {
    stopRecord(sendRecordFile);
};
