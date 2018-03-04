/**
 * Created by Jad_PC on 2018/2/6.
 */

import {all, take, call, put, fork} from 'redux-saga/effects';
import {routerActions} from 'react-router-redux';
import {sessionActions} from './../actions';
import {message} from 'antd';
import fetchProxy from './../utils/fetchProxy';

window.message = message;
const delay = time => new Promise(res => {setTimeout(res, time);});
const loginUrl = `${location.origin}/login`;
const logoutUrl = `${location.origin}/logout`;
const registerUrl = `${location.origin}/register`;

window.routerActions = routerActions;
function* login({username, password}){
    try{
        yield delay(500);
        let result = yield call(fetchProxy, loginUrl, {method: 'POST', contentType: 'application/json', payload: {username, password}});
        if(result.success === '1'){
            yield put(sessionActions.login('receive', result.value));
            //登录成功后控制页面跳转至登录前的页面
            let nextUrl = location.href.split('nextUrl=')[1] || null;
            nextUrl = (nextUrl) ? decodeURIComponent(nextUrl) : '/';
            if(nextUrl.startsWith('/api/')){
                //如果登录前访问的是/api接口，则直接将页面url跳转至该接口，因为前端路由中不含有/api接口，会跳转至404页面
                window.location.href = location.origin + nextUrl;
            } else {
                yield put(routerActions.push(nextUrl));
            }
        } else {
            message.error(result.value);
            yield put(sessionActions.login('error', result.value));
        }
    } catch (err){
        message.error(err);
        yield put(sessionActions.login('error', err));
    }
}

function* logout(){
    try{
        const result = yield call(fetchProxy, logoutUrl);
        if(result.success == '0'){
            message.error(result.value);
            yield put(sessionActions.logout('error', result.value));
        } else {
            yield put(sessionActions.logout('receive'));
            yield put(routerActions.push('/login'));
        }
    } catch(err){
        message.error(err);
        yield put(sessionActions.logout('error', err));
    }
}

function* register({username, password, email}){
    try {
        let result = yield call(fetchProxy, registerUrl, {
            method: 'POST',
            contentType: 'application/json',
            payload: {name: username, password, email}
        });
        if (result.success === '0') {
            message.error(result.value);
        }
        if (result.success === '1') {
            message.success(result.value);
            yield put(routerActions.push('/login'));
        }
    } catch(err){
        message.error(err);
    }
}

function* watchLogin(){
    while(true){
        const {username, password} = yield take(sessionActions.LOGIN_REQUEST);
        yield fork(login, {username, password});
    }
}

function* watchLogout(){
    while(true){
        yield take(sessionActions.LOGOUT_REQUEST);
        yield fork(logout);
    }
}

function* watchRegister(){
    while(true){
        const {username, password, email} = yield take(sessionActions.REGISTER_REQUEST);
        yield fork(register, {username, password, email});
    }
}

export default function* sessionSaga(){
    yield all([call(watchLogin), call(watchLogout), call(watchRegister)]);
}