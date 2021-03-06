import React from 'react';
import styled from 'styled-components';
import { transitions } from '../../lib/styleUtil';

const Wrapper = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: #FF3939;
    font-weight: 500;
    text-align: center;
    animation: ${transitions.shake} 0.3s ease-in;
    animation-fill-mode: forwards;
`;

const SettingError = ({children}) => (
    <Wrapper>
        {children}
    </Wrapper>
);

export default SettingError;