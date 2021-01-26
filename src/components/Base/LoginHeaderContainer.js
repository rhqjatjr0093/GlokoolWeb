import React, { Component } from 'react';
import Header, { LogoutButton } from '../Base/Header';
import { connect } from 'react-redux';

class LoginHeaderContainer extends Component {
    render() {
        return (
            <Header>
                <LogoutButton/>
            </Header>
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['loginHeader', 'visible'])
    }),
    (dispatch) => ({

    })
)(LoginHeaderContainer);