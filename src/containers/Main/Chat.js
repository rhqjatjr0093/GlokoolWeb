import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from '../../Firebase';
import * as authActions from '../../redux/modules/Auth';


class Chat extends React.Component {
  render(){
    return(
      <div>
        
      </div>
    );
  }
    
  
}

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
      AuthActions: bindActionCreators(authActions, dispatch)
  })
)(Chat);