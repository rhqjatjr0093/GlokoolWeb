import React, { Component } from "react";
import Header, { LoginButton, SignUpButton } from "../Base/Header";
import { connect } from "react-redux";
import MainBody from "./MainBody";

class HeaderContainer extends Component {
  render() {
    const { visible } = this.props;
    if (!visible) return null;

    return (
      <div className="app">
        <Header>
          <LoginButton />
          <SignUpButton />
        </Header>
        <MainBody />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    visible: state.base.getIn(["header", "visible"]),
  }),
  (dispatch) => ({})
)(HeaderContainer);
