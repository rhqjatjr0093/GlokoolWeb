import React from 'react';
import GoogleLoginButton from '../assets/btn_google_signin_dark_normal_web@2x.png';
import { useHistory } from "react-router-dom";
import { signInWithGoogle, auth } from '../Firebase'; 
import './login.css'

const Login = () => {
  const history = useHistory();

  const GoogleLogin = () => {
    signInWithGoogle().then((response) => {
      console.log(response);
      history.push('/home')
    })
    .catch((response) => {
      console.log(response)
    })

  }

    return (
      <html className="App">
        <div className="Container">
          <button className='Button' onClick={GoogleLogin}><img className="ButtonImage" src={GoogleLoginButton} alt='GoogleLoginButton'/></button>
        </div>        
      </html>
    );
  };
  





export default Login;