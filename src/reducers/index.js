/**
 * Created by Jad_PC on 2018/1/25.
 */
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import getSession from './sessionReducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    getSession
});

export default rootReducer;
