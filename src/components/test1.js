/**
 * Created by Jad_PC on 2017/9/13.
 */
import React from 'react';
import * as d3 from 'd3';
import styles from './test1.scss';

export default class extends React.Component{
    componentDidMount(){
        d3.select(`.${styles.container}`)
            .selectAll('p')
            .text('这是测试一');
    }

    render(){
        return(
            <div className={styles.container}>
                <p className="test"></p>
            </div>
        );
    }
}