import React, { Component } from "react";
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  AuthDate,
  AuthGender,
  AuthError,
} from "../../components/Auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { auth, firestore } from "../../Firebase";
import * as authActions from "../../redux/modules/Auth";
import moment from "moment";
import { isEmail, isLength, isAlphanumeric, toDate } from "validator";

const profileDocUpdate = async (user, name, email, gender, birthDate) => {
  var userDocument = await firestore()
    .collection("Guides")
    .doc(user?.uid)
    .set({
      name: name,
      email: email,
      gender: gender,
      signupDate: new Date(), //가입한 날짜
      birthDate: birthDate,
      avatar: '',
    })
    .then(() => {
      console.log("프로필 문서 업데이트 성공");
    })
    .catch(() => {
      console.log("프로필 문서 업데이트 성공");
    });
};

const profileUpdate = async (user, name) => {
  var profile = await user
    .updateProfile({
      displayName: name,
      photoURL: "",
    })
    .then(() => {
      console.log("프로필 업데이트 성공");
    })
    .catch(() => {
      console.log("프로필 업데이트 실패");
    });
};

class Register extends Component {
  componentDidMount() {
    if (auth().currentUser != null) {
      console.log(auth().currentUser);
      this.props.history.push("/main");
    }
  }

  componentWillUnmount() {
    //화면을 이동할때 실행
    //입력값 초기화 실행

    this.handleChange({ target: { name: "email", value: "" } });
    this.handleChange({ target: { name: "password", value: "" } });
    this.handleChange({ target: { name: "passwordConfirm", value: "" } });
    this.handleChange({ target: { name: "birthDate", value: "" } });
    this.handleChange({ target: { name: "gender", value: "Male" } });
  }

  setError = (message) => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      form: "register",
      message,
    });
  };

  validate = {
    email: (value) => {
      if (!isEmail(value)) {
        this.setError("잘못된 이메일 형식 입니다.");
        return false;
      }
      this.setError(null);
      return true;
    },
    username: (value) => {
      if (!isAlphanumeric(value) || !isLength(value, { min: 4, max: 15 })) {
        this.setError(
          "닉네임은 4~15 글자의 알파벳 혹은 숫자로 이뤄져야 합니다."
        );
        return false;
      }
      this.setError(null);
      return true;
    },
    password: (value) => {
      if (!isLength(value, { min: 8 })) {
        this.setError("비밀번호를 8자 이상 입력하세요.");
        return false;
      }
      this.setError(null);
      return true;
    },
    passwordConfirm: (value) => {
      if (this.props.form.get("password") !== value) {
        this.setError("입력한 비밀번호와 일치하지 않습니다.");
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
    },
  };

  handleChange = (e) => {
    const { AuthActions } = this.props;
    const { name, value } = e.target;

    AuthActions.changeInput({
      name,
      value,
      form: "register",
    });

    const validation = this.validate[name](value);
  };

  handleLocalRegister = async () => {
    const { form, AuthActions, error, history } = this.props;
    const {
      email,
      username,
      password,
      passwordConfirm,
      birthDate,
      gender,
    } = form.toJS();

    const { validate } = this;

    if (error) return;
    if (
      !validate["email"](email) ||
      !validate["username"](username) ||
      !validate["password"](password) ||
      !validate["passwordConfirm"](passwordConfirm) ||
      !validate["birthDate"](birthDate)
    ) {
      return;
    }

    this.setError(null);

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (response) => {
        await profileDocUpdate(
          response.user,
          username,
          email,
          gender,
          birthDate
        );
        await profileUpdate(response.user, username);
        this.props.history.push("/auth/email/verification");
      })
      .catch((error) => {
        var errorCode = error.code;

        if (errorCode == "auth/email-already-in-use") {
          this.setError("이미 사용중인 이메일입니다.");
        } else if (errorCode == "auth/weak-password") {
          this.setError("비밀번호가 너무 약합니다");
        } else {
          this.setError(errorCode);
        }
      });
  };

  render() {
    const { error } = this.props;
    const {
      email,
      username,
      password,
      passwordConfirm,
      birthDate,
      gender,
    } = this.props.form.toJS();
    const { handleChange, handleLocalRegister } = this;

    return (
      <AuthContent title="회원가입">
        <InputWithLabel
          label="이메일"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={handleChange}
        />
        <InputWithLabel
          label="닉네임"
          name="username"
          placeholder="가이드 명으로 표시됩니다"
          value={username}
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
        <InputWithLabel
          label="비밀번호 확인"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={handleChange}
        />
        <AuthDate
          label="생년월일"
          value={birthDate}
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          closeOnSelect={true}
          onChange={(date) =>
            handleChange({
              target: { name: "birthDate", value: moment(date).format("X") },
            })
          }
        />
        <AuthGender
          label="성별"
          value={"Male"}
          onChange={(gender) =>
            handleChange({
              target: { name: "gender", value: gender.target.value },
            })
          }
        />
        {error && <AuthError>{error}</AuthError>}
        <AuthButton onClick={handleLocalRegister}>회원가입</AuthButton>
      </AuthContent>
    );
  }
}

export default connect(
  (state) => ({
    form: state.auth.getIn(["register", "form"]),
    error: state.auth.getIn(["register", "error"]),
    exists: state.auth.getIn(["register", "exists"]),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
  })
)(Register);
