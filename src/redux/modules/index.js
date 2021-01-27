import { combineReducers } from 'redux';
import base from './base';
import auth from './Auth';
import main from './Main';
import { penderReducer } from 'redux-pender';

export default combineReducers({
    base,
    auth,
    main,
    pender: penderReducer
});