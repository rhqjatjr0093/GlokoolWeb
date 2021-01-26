import React, { Component } from 'react';
import { AuthContent, AuthButton, AuthText } from '../../components/Auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from '../../Firebase';
import * as authActions from '../../redux/modules/Auth';


const user = auth().currentUser;

const sendEmail = async() => {
    auth().languageCode = 'kr'; // 한국어로 이메일 전송
    await user.sendEmailVerification()
        .then(function() {
            //이메일을 성공적으로 전송
            //로그 아웃
            auth().signOut();
        })
        .catch(function(error){
            console.log(error);
        })
}

const retry = (func, params = [], maxRetriesCount = 5, interval = 500) => new Promise((resolve, reject) => {
    func(...params)
      .then((response) => resolve(response))
      .catch((err) => {
        if (maxRetriesCount === 0) {
          reject(err); 
          return;
        }
        setTimeout(() => {
          console.log('retry!');
          retry(func, params, maxRetriesCount - 1).then(resolve, reject);
        }, interval);
     });
  });

class Email extends Component {
    
    componentDidMount() {
        //첫 로딩후에만 실행되는 코드
        //이메일 전송 및 확인 (오류 발생시 최대 5번 재시도)
        if(user != null){
            retry(sendEmail);
        }
        else{
            console.log('잘못된 접근')
            this.props.history.push('/');
        }

    }

    handleClick = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <AuthContent title="이메일 인증">
                <AuthText context='이메일 주소로 인증링크가 발송되었습니다'/>
                <AuthText context='링크를 클릭해주세요'/>
                <AuthButton onClick={this.handleClick}>메인으로</AuthButton>
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
)(Email);