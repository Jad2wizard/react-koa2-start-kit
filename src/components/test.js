/**
 * Created by Jad_PC on 2017/9/13.
 */
import React from 'react';
import * as d3 from 'd3';
import styles from './test.scss';
window.d3 = d3;
export default class extends React.Component{
    componentDidMount(){
        d3.select(`.${styles.container}`)
            .selectAll('p')
            .text('hello, world!');
    }

    render(){
        return(
            <div className={styles.container}>
                <p className="test"></p>
                <p className="test"></p>
                <p className="test"></p>
            </div>
        );
    }
}