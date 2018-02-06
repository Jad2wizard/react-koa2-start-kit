/**
 * Created by Jad_PC on 2018/2/6.
 */

export const LOGIN_REQUEST = '发起登录请求';
export const LOGIN_RECEIVE = '登录成功';
export const LOGIN_ERROR = '登录失败';
export const LOGOUT_REQUEST = '发起注销请求';
export const LOGOUT_RECEIVE = '注销成功';
export const LOGOUT_ERROR = '注销失败';

export const login = (status, param) => {
    switch (status){
        case 'request':
            return {
                type: LOGIN_REQUEST,
                username: param.username,
                password: param.password
            };
        case 'receive':
            return {
                type: LOGIN_RECEIVE,
                user: param
            };
        case 'error':
            return {
                type: LOGIN_ERROR,
                error: param
            };
    }
};

export const logout = (status, param) => {
    switch (status){
        case 'request':
            return {
                type: LOGOUT_REQUEST
            };
        case 'receive':
            return {
                type: LOGOUT_RECEIVE
            };
        case 'error':
            return {
                type: LOGOUT_ERROR,
                error: param
            };
    }
};