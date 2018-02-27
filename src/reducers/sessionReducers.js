/**
 * Created by Jad_PC on 2018/2/6.
 */

import {combineReducers} from 'redux';
import {sessionActions} from './../actions';

const user = (state = window.user, action) => {
    switch (action.type){
        case sessionActions.LOGIN_RECEIVE:
            return action.user.username;
        case sessionActions.LOGOUT_RECEIVE:
            return null;
        default:
            return state;
    }
};

const email = (state = window.email, action) => {
    switch (action.type){
        case sessionActions.LOGIN_RECEIVE:
            return action.user.email;
        case sessionActions.LOGOUT_RECEIVE:
            return null;
        default:
            return state;
    }
};

const isLoading = (state = false, action) => {
    switch (action.type){
        case sessionActions.LOGIN_REQUEST:
        case sessionActions.LOGOUT_REQUEST:
            return true;
        case sessionActions.LOGIN_RECEIVE:
        case sessionActions.LOGIN_ERROR:
        case sessionActions.LOGOUT_RECEIVE:
        case sessionActions.LOGOUT_ERROR:
            return false;
        default:
            return state;
    }
};

const getSession = combineReducers({
    isLoading,
    user,
    email
});

export default getSession;