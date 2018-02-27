/**
 * Created by Jad_PC on 2018/2/27.
 */
import React from 'react';
import {Button} from 'antd';
import styles from './voiceBtn.scss';
import {startVoiceRecord, stopAndSendRecord} from './../utils/voiceCapture';

export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isMousedown: false
        };
    }
    render(){
        const {isMousedown} = this.state;
        return (
            <div
                className={styles.container}
                onMouseDown={() => {
                    this.setState({
                        isMousedown: true
                    });
                    startVoiceRecord(); //按下按钮后开始录音
                }}
                onMouseUp={() => {
                    this.setState({
                        isMousedown: false
                    });
                    stopAndSendRecord(); //松开按钮后停止录音，并将录音发送到服务器进行识别
                }}
            >
                <Button>{!isMousedown ? '按下开始录音' : '松开停止录音'}</Button>
            </div>
        );
    }
}
