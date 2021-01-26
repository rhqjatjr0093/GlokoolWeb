import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as baseActions from '../redux/modules/base';
import LoginHeaderContainer from '../components/Base/LoginHeaderContainer';
import { Chat } from '../containers/Main';
import { ChatWrapper } from '../components/Chat'


class Main extends Component {
    render() {
        return (
          <Route path="/main/chat" component={Chat}/> 
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