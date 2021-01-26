import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import HeaderContainer from '../components/Base/HeaderContainer'
import * as baseActions from '../redux/modules/base';


class Home extends Component {
    render() {
        return (
            <div>
                <div>
                    <HeaderContainer/>
                </div>                                        
            </div>
            
        );
    }
}

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(Home);