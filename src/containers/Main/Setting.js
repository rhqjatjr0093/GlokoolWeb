import React, { Component, useState } from "react";
import { makeStyles, useTheme, Text } from "@material-ui/core/styles";
import {
  SettingContent,
  InputWithLabel,
  SettingButton,
  SettingDate,
  SettingGender,
  SettingError,
} from "../../components/Setting";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { auth, firestore } from "../../Firebase";
import * as authActions from "../../redux/modules/Setting";
import moment from "moment";
import { AuthWrapper } from "../../components/Auth";

class Setting extends Component {
  render() {
    const { error, birthDate } = this.props;
    return (
      <AuthWrapper>
        <SettingContent title="회원 정보 수정">
          <InputWithLabel
            label="이메일"
            name="email"
            value="userEmail"
            readonly
          />
          <InputWithLabel label="닉네임" name="username" value="username" />
          <InputWithLabel
            label="비밀번호"
            name="password"
            type="password"
            value="password"
          />
          <InputWithLabel
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value="password"
          />
          <SettingDate
            label="생년월일"
            value={birthDate}
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            closeOnSelect={true}
            value="birthDate"
            // onChange={(date) =>
            //   handleChange({
            //     target: { name: "birthDate", value: moment(date).format("X") },
            //   })
            // }
          />
          <SettingGender label="성별" value={"Male"} />
          {error && <SettingError>{error}</SettingError>}
          <SettingButton>수정</SettingButton>
        </SettingContent>
      </AuthWrapper>
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
