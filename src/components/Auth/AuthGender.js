import React from 'react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Wrapper = styled.div`
    margin-top: 1rem;    
`;

const Label = styled.div`
    font-size: 1rem;
    color: #5F5F5F;
    margin-bottom: 0.25rem;
`;

const Input = styled.input`
    width: 100%;
    box-sizing : border-box;
    border: 1px solid #707070;
    outline: none;
    border-radius: 0px;
    line-height: 2.5rem;
    font-size: 1.2rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`;


const AuthGender = ({label, ...rest}) => (
    
    <Wrapper>
        <Label>{label}</Label>
        <Select {...rest} style={{fontSize: '1.2rem'}}>
          <MenuItem value={'Male'}>Male</MenuItem>
          <MenuItem value={'Female'}>Female</MenuItem>
        </Select>
    </Wrapper>

    
);

export default AuthGender;

