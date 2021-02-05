import React, { Component } from 'react';
import Header, { LogoutButton, SettingButton } from '../Base/Header';
import { connect } from 'react-redux';

class LoginHeaderContainer extends Component {
    render() {
        return (
            <Header>
                <SettingButton/>
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