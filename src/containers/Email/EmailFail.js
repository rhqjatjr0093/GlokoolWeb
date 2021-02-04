import React, { Component } from 'react';
import { AuthContent, AuthButton, AuthText } from '../../components/Auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from '../../Firebase';
import * as authActions from '../../redux/modules/Auth';

const user = auth().currentUser;

class EmailFail extends Component {
    
    componentDidMount() {
    }

    handleClick = () => {
        this.props.history.push('/email/verification');
    }

    handleClick2 = () => {
        auth().signOut();
        this.props.history.push('/');
    }

    render() {
        return (
            <AuthContent title="이메일 인증 실패">
                <AuthText context='이메일 인증이 완료되지 않았습니다'/>
                <AuthText context='링크를 클릭해주세요'/>
                <AuthButton onClick={this.handleClick}>이메일 재 전송</AuthButton>
                <AuthButton onClick={this.handleClick2}>메인으로</AuthButton>
            </AuthContent>
        );
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch)
    })
)(EmailFail);