import React from 'react';
import styled from 'styled-components';

// 두개가 함께 있을땐 상단 (그 사이) 에 여백을 준다
const Wrapper = styled.div`
    & + & {
        margin-top: 1rem;
    }
`;

const Label = styled.div`
    font-size: 1rem;
    color: #5F5F5F;
    margin-bottom: 0.25rem;
`;

const Input = styled.input`
    width: 100px;
    height: 100px;
    box-sizing : border-box;
    border: 1px solid #707070;
    outline: none;
    border-radius: 50%;
    font-size:15px;
`;

// rest 쪽에는 onChange, type, name, value, placeholder 등의 input 에서 사용 하는 값들을 넣어줄수 있다.
const SettingPic = ({label, ...rest}) => (
    <Wrapper>
        <Label>{label}</Label>
        <Input {...rest}/>
    </Wrapper>
);

export default SettingPic;