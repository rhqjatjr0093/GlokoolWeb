import React from 'react';
import styled from 'styled-components';
import { shadow } from '../../lib/styleUtil';

const Wrapper = styled.div`
    width: 100%;
    margin-top: 1rem;
    padding-top: 0.6rem;
    padding-bottom: 0.5rem;

    background: #FFC043;
    color: white;

    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;

    cursor: pointer;
    user-select: none;
    transition: .2s all;

    &:hover {
        background: #FDBB37;
        ${shadow(0)}
    }

    &:active {
        background: #F8B736;
    }

`;

const SettingButton = ({children, onClick}) => (
    <Wrapper onClick={onClick}>
        {children}
    </Wrapper>
);

export default SettingButton;