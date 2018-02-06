/**
 * Created by Jad_PC on 2018/1/25.
 */
import {call, all} from 'redux-saga/effects';
import sessionSagas from './sessionSagas';

function* rootSaga(){
    yield all([call(sessionSagas)]);
}

export default rootSaga;