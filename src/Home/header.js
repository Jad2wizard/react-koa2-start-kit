/**
 * Created by Jad_PC on 2018/2/7.
 */
import React from 'react';
import {Layout, Icon} from 'antd';
import {connect} from 'react-redux';
import styles from './header.scss';
import {sessionActions} from './../actions';

const {Header} = Layout;

class MyHeader extends React.Component{
    render(){
        return (
            <Header className={styles.container}>
                <div className={styles.icon}></div>
                <h1>Header</h1>
                <div className={styles.logout} title="登出" onClick={this.props.onLogout}>
                    <Icon type="logout" />
                    {this.props.user}
                </div>
            </Header>
        );
    }
}

const mapStateToProps = state => ({
    user: state.getSession.user
});

const mapDispatchToProps = dispatch => ({
    onLogout: () => {
        dispatch(sessionActions.logout('request'));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MyHeader);
