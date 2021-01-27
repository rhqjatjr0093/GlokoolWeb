import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as baseActions from '../redux/modules/base';
import LoginHeaderContainer from '../components/Base/LoginHeaderContainer';
import Chat from '../containers/Main/Chat';
import { ChatRoomLeft } from '../components/Chat'



class Main extends Component {
    render() {
        return (
            <div className={{display : 'flex'}}>
                <LoginHeaderContainer/>
                <Chat/>                  
            </div>
            


        );
    }
}

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(Main);