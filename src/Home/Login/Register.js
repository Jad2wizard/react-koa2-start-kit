/**
 * Created by Jad_PC on 2018/3/4.
 */
import React from 'react';
import {connect} from 'react-redux';
import {routerActions} from 'react-router-redux';
import {Input, message} from 'antd';
import {sessionActions} from './../../actions';
import styles from './Login.scss';

const checkUsername = (username) => {
    if(!username){
        return '用户名不能为空';
    }
    return null;
};

const checkPassword = (password) => {
    if(!password){
        return '密码不能为空';
    }
    return null;
};

const checkEmail = (email) => {
    if(!email){
        return '邮箱不能为空';
    }
    return null;
};


class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            isRegister: false
        };
    }

    handleChange = (param) => {
        this.setState({
            ...this.state,
            ...param
        });
    }

    render(){
        const {isLoading, handleRegister, jumpToLogin} = this.props;
        const {username, password, email} = this.state;
        return (
            <div className={styles.container}>
                <section className={styles.loginBlock}>
                    <header className={styles.header}><p>注册</p></header>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}><p>用户名</p></div>
                        <div className={styles.inputSection}>
                            <Input disabled={isLoading} type="text" value={username} onChange={(e) => {this.handleChange({username: e.target.value});}} placeholder="请输入用户名" />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}><p>密码</p></div>
                        <div className={styles.inputSection}>
                            <Input disabled={isLoading} type="password" value={password} onChange={(e) => {this.handleChange({password: e.target.value});}} placeholder="请输入密码" />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}><p>邮箱</p></div>
                        <div className={styles.inputSection}>
                            <Input disabled={isLoading} type="text" value={email} onChange={(e) => {
                                this.handleChange({email: e.target.value});
                            }} placeholder="请输入邮箱地址"/>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button disabled={isLoading} className={`${styles.button} ${styles.confirmBtn}`} onClick={() => {handleRegister(username, password, email);}}>确认</button>
                        <button disabled={isLoading} className={`${styles.button} ${styles.registerBtn}`} onClick={jumpToLogin}>取消</button>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {user, isLoading} = state.getSession;
    return {user, isLoading};
};

const mapDispatchToProps = dispatch => ({
    handleRegister: (username, password, email) => {
        const usnCheckRes = checkUsername(username);
        const pwdCheckRes = checkPassword(password);
        const emailCheckRes = checkEmail(email);
        if(usnCheckRes){
            message.warn(usnCheckRes);
            return;
        }
        if(pwdCheckRes){
            message.warn(pwdCheckRes);
            return;
        }
        if(emailCheckRes){
            message.warn(emailCheckRes);
            return;
        }
        dispatch(sessionActions.register('request', {username, password, email}));
    },
    jumpToLogin: () => {
        dispatch(routerActions.push('/login'));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);