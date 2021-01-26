import React, { Component } from 'react';
import { AuthContent, InputWithLabel, AuthButton, AuthError } from '../../components/Auth';
import { auth } from '../../Firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../../redux/modules/Auth';


class Login extends Component {

    componentDidMount() {
        if(auth().currentUser != null){
            console.log(auth().currentUser);
            this.props.history.push('/main');
        }
    }

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'login',
            message
        });
    }

    handleChange = (e) => {
        const { AuthActions } = this.props;
        const { name, value } = e.target;

        AuthActions.changeInput({
            name,
            value,
            form: 'login'
        });
    }

    handleLogin = () => {
        const { form, error } = this.props;
        const { email, password } = form.toJS();
        
        auth().setPersistence(auth.Auth.Persistence.LOCAL);

        auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode);
                
                if(errorCode == 'auth/invalid-email'){
                    this.setError('올바르지 않은 이메일 형식입니다');
                }
                else if (errorCode == 'auth/user-disabled'){
                    this.setError('정지된 회원입니다');
                }
                else if (errorCode == 'auth/user-not-found'){
                    this.setError('없는 회원입니다. 이메일을 확인해주세요');
                }
                else if (errorCode == 'auth/wrong-password'){
                    this.setError('비밀번호가 틀렸습니다');
                }
                else{
                    this.setError(errorCode);
                }
            })
    }

    render() {
        const { error } = this.props;
        const { email, password } = this.props.form.toJS(); // form 에서 email 과 password 값을 읽어옴
        const { handleChange, handleLogin } = this;

        return (
            <AuthContent title="로그인">
                <InputWithLabel 
                    label="이메일" 
                    name="email" 
                    placeholder="이메일" 
                    value={email} 
                    onChange={handleChange}
                />
                <InputWithLabel 
                    label="비밀번호" 
                    name="password" 
                    placeholder="비밀번호" 
                    type="password" 
                    value={password} 
                    onChange={handleChange}
                />
                {
                    error && <AuthError>{error}</AuthError>
                }
                <AuthButton onClick={() => handleLogin()}>로그인</AuthButton>
            </AuthContent>
        );
    }
}

export default connect(
    (state) => ({
        form: state.auth.getIn(['login', 'form']),
        error: state.auth.getIn(['login', 'error']),
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch)
    })
)(Login);