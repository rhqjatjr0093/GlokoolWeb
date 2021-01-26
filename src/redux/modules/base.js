import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

const SET_HEADER_VISIBILITY = 'base/SET_HEADER_VISIBILITY'; // 헤더 렌더링 여부 설정
const SET_LOGIN_HEADER_VISIBILITY = 'base/SET_LOGIN_HEADER_VISIBILITY';

export const setHeaderVisibility = createAction(SET_HEADER_VISIBILITY); // visible
export const setLoginHeaderVisibility = createAction(SET_LOGIN_HEADER_VISIBILITY);

const initialState = Map({
    header: Map({
        visible: true
    }),
    loginHeader: Map({
        visible: false
    }),
});

export default handleActions({
    [SET_HEADER_VISIBILITY]: (state, action) => state.setIn(['header', 'visible'], action.payload),
    [SET_LOGIN_HEADER_VISIBILITY]: (state, action) => state.setIn(['loginHeader', 'visible'], action.payload)
}, initialState);