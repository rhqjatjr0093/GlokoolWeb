import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import HeaderContainer from "../components/Base/HeaderContainer";
import * as baseActions from "../redux/modules/base";
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Terms from "../components/Base/Terms";
import PerInfo from "../components/Base/PerInfo";
import MainFooter from '../components/Base/MainFooter'

class Desc extends Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <HeaderContainer />
        {/* 라우터 */}
        <Router>
          <Switch>            
            <Route exact path="/desc/terms" component={Terms}></Route>
            <Route exact path="/desc/perinfo" component={PerInfo}></Route>
          </Switch>
        </Router>
        <MainFooter/>
      </div>
    );
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
  })
)(Desc);
