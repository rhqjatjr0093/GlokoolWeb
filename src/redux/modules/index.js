import { combineReducers } from 'redux';
import base from './base';
import auth from './Auth';
import { penderReducer } from 'redux-pender';

export default combineReducers({
    base,
    auth,
    pender: penderReducer
});