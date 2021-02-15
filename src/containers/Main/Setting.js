import React, { Component, useState } from 'react';
import { makeStyles, useTheme, Text } from '@material-ui/core/styles';
import { SettingContent, InputWithLabel, SettingButton, SettingDate, SettingGender, SettingError } from '../../components/Setting';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth, firestore } from '../../Firebase'
import * as authActions from '../../redux/modules/Setting';
import moment from 'moment';
import { AuthWrapper } from '../../components/Auth'



class Setting extends Component {   
    render() {
        return (
            <AuthWrapper>  
            </AuthWrapper>
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

export default Setting;