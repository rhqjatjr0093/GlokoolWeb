import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const initialState = Map({
    chatRoom: Map([])
});

export default handleActions({

}, initialState);