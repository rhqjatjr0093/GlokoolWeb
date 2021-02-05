import React, { Component, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { SettingContent, InputWithLabel, SettingButton, SettingDate, SettingGender, SettingError } from '../../components/Setting';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth, firestore } from '../../Firebase'
import * as authActions from '../../redux/modules/Setting';
import moment from 'moment';
import {isEmail, isLength, isAlphanumeric, toDate} from 'validator';
import classes from '*.module.css';

const user = auth().currentUser;
const [userData, setUserData] = useState(
    {
        name : '',
        email : '',
        gender : '',
        signupDate : new Date(),  //가입한 날짜
        birthDate : ''
    }
)

const [picture, setPicture] = useState(user.photoURL);


const profileDocUpdate = async(user, name, email, gender, birthDate) => {

    var userDocument = await firestore()
      .collection('Guides')
      .doc(user?.uid)
      .set({
        name : name,
        email : email,
        gender : gender,
        signupDate : new Date(),  //가입한 날짜
        birthDate : birthDate
      })
      .then(() => {
        console.log('프로필 문서 업데이트 성공')
      })
      .catch(() => {
        console.log('프로필 문서 업데이트 성공')
      })

};

const profileUpdate = async(user, name) => {

    var profile = await user.updateProfile({
      displayName : name,
      photoURL: ''          
    })
    .then(() => {
      console.log('프로필 업데이트 성공')
    })
    .catch(() => {      
      console.log('프로필 업데이트 실패')
    })
};




class Setting extends Component {

    

    componentDidMount() {
        if(auth().currentUser != null){
            console.log(auth().currentUser);
            this.props.history.push('/main');
        }

        const userDocument = await firestore().collection('Guides').doc(user?.uid)
        await userDocument.get()
            .then((data) => {
                setUserData(data);
        });

        this.handleChange({target: {name : 'email', value: userData.name}});
        this.handleChange({target: {name : 'birthDate', value: userData.birthDate}});
        this.handleChange({target: {name : 'gender', value: userData.gender}});
    }

    componentWillUnmount() {
        //화면을 이동할때 실행 
        //입력값 초기화 실행

        this.handleChange({target: {name : 'name', value: ''}});
        this.handleChange({target: {name : 'birthDate', value: ''}});
        this.handleChange({target: {name : 'gender', value: 'Male'}});
    }
    

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'setting',
            message
        });
    }

    validate = {
        username: (value) => {
            if(!isAlphanumeric(value) || !isLength(value, { min:4, max: 15 })) {
                this.setError('아이디는 4~15 글자의 알파벳 혹은 숫자로 이뤄져야 합니다.');
                return false;
            }
            this.setError(null);
            return true;
        },
        birthDate: (value) => {
            return true;
        },
        gender: (value) => {
            return true;
        }
    }


    handleChange = (e) => {
        const { AuthActions } = this.props;
        const { name, value } = e.target;

        
        AuthActions.changeInput({
            name,
            value,
            form: 'setting'
        });

        const validation = this.validate[name](value);
    }

    handleLocalRegister = async () => {

        const { form, AuthActions, error, history } = this.props;
        const { email, username, password, passwordConfirm, birthDate, gender } = form.toJS();
        
        const { validate } = this;

        if(error) return;
        if(!validate['email'](email) 
            || !validate['username'](username) 
            || !validate['birthDate'](birthDate)
            ) { 
            return;
        }

        this.setError(null);

        await auth().createUserWithEmailAndPassword(email, password)
            .then(async(response) => {
                await profileDocUpdate(response.user, username, email, gender, birthDate);
                await profileUpdate(response.user, username);
                this.props.history.push('/auth/email');
            })
            .catch((error) => {
                var errorCode = error.code;

                if(errorCode == 'auth/email-already-in-use'){
                    this.setError('이미 사용중인 이메일입니다.');
                }
                else if (errorCode == 'auth/weak-password') {
                    this.setError('비밀번호가 너무 약합니다');
                }
                else{
                    this.setError(errorCode);
                }
            })
        
    }    



    render() {
        const { error } = this.props;
        const { username, birthDate, gender } = this.props.form.toJS();
        const { handleChange, handleLocalRegister} = this;
        const classes = useStyles();

        return (
            <div className={classes.mainContainer}>
                <div className={classes.container}>
                    <SettingContent title="개인정보 수정">
                        <InputWithLabel 
                            label="닉네임" 
                            name="username" 
                            placeholder="가이드 명으로 표시됩니다" 
                            value={username} 
                            onChange={handleChange}
                        />
                        <SettingDate
                            label='생년월일'
                            value={birthDate}
                            dateFormat="YYYY-MM-DD"
                            timeFormat={false}
                            closeOnSelect={true}
                            onChange={date => handleChange({ target: { name: 'birthDate', value: moment(date).format('X')} })}
                        />
                        <SettingGender
                            label='성별'
                            value={'Male'}
                            onChange={gender => handleChange({target: { name: 'gender', value: gender.target.value}})}
                        />
                        {
                            error && <SettingError>{error}</SettingError>
                        }
                        <SettingButton onClick={handleLocalRegister}>회원가입</SettingButton>
                    </SettingContent>
                </div>
                
                {/* 사진만 저장하는 컨테이너 */}
                <div className={classes.container}>

                </div>
            </div>
            
        );
    }
}
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        flexDirection: 'row',
        
    },
    container: {
        flex: 1
    }

}));

export default connect(
    (state) => ({
        form: state.auth.getIn(['register', 'form']),
        error: state.auth.getIn(['register', 'error']),
        exists: state.auth.getIn(['register', 'exists'])
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch)
    })
)(Setting);