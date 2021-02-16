import React, { Component, useState } from "react";
import { makeStyles, useTheme, Text } from "@material-ui/core/styles";
import {
  SettingContent,
  InputWithLabel,
  SettingButton,
  SettingDate,
  SettingGender,
  SettingError,
  SettingWrapper,
  SettingWithLabel,
} from "../../components/Setting";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { auth, firestore } from "../../Firebase";
import * as authActions from "../../redux/modules/Setting";
import moment from "moment";
import { AuthWrapper } from "../../components/Auth";
import { isEmail, isLength, isAlphanumeric, toDate } from "validator";
import SettingPic from "../../components/Setting/SettingPic";
import MenuItem from "@material-ui/core/MenuItem";

class Setting extends Component {
  validate = {
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

  render() {
    const { form, error } = this.props;
    const {
      userPic,
      email,
      username,
      password,
      passwordConfirm,
      birthDate,
      gender,
    } = this.props;

    const { handleChange } = this;

    return (
      <SettingWrapper>
        <SettingContent title="회원 정보 수정">
          {/* <SettingPic name="userPic" value={userPic} /> */}
          <InputWithLabel
            label="이메일"
            name="email"
            value="userEmail"
            readonly
          />

          <InputWithLabel
            label="닉네임"
            name="username"
            value={username}
            onChange={handleChange}
          />
          <InputWithLabel
            label="비밀번호"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <InputWithLabel
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={handleChange}
          />
          <SettingDate
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
          <SettingGender label="성별" value={"Male"} />
          {error && <SettingError>{error}</SettingError>}
          <SettingButton>수정</SettingButton>
        </SettingContent>
      </SettingWrapper>
    );
  }
}
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
}));

export default Setting;
