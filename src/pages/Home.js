import React, { Component } from "react";
import { auth } from "../Firebase";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import HeaderContainer from "../components/Base/HeaderContainer";
import * as baseActions from "../redux/modules/base";
import MainBody from "../components/Base/MainBody";
import MainFooter from "../components/Base/MainFooter";

class Home extends Component {
  componentDidMount() {
    const user = auth().currentUser;
    //첫 로딩후에만 실행되는 코드
    //이메일 전송 및 확인 (오류 발생시 최대 5번 재시도)
    if (user != null) {
      this.props.history.push("/main");
    } else {
      console.log(user);
    }
  }
  render() {
    return (
      <div>
          <HeaderContainer />
          <MainBody />
          <MainFooter />
      </div>
    );
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
  })
)(Home);
