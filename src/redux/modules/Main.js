import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { auth, firestore } from '../../Firebase';

const CHANGE_INPUT = 'main/CHANGE_INPUT'; // input 값 변경
const INITIALIZE_FORM = 'main/INITIALIZE_FORM'; // form 초기화

export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form 

const SET_ERROR = 'main/SET_ERROR'; // 오류 설정

const initialState = Map({
    chatRoom: Map([]),
    setting: Map({
        name : '',
        email : '',
        gender : '',
        signupDate : new Date(),  //가입한 날짜
        birthDate : new Date()
    })
});

export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, value } = action.payload;
        return state.setIn([form, 'form', name], value);
    },
    [INITIALIZE_FORM]: (state, action) => {
        const initialForm = initialState.get(action.payload);
        return state.set(action.payload, initialForm);
    },
    [SET_ERROR]: (state, action) => {
        const { form, message } = action.payload;
        return state.setIn([form, 'error'], message);
    }
}, initialState);