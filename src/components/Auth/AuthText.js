import React from 'react';
import styled from 'styled-components';

// 두개가 함께 있을땐 상단 (그 사이) 에 여백을 준다
const Wrapper = styled.div`
    & + & {
        margin-top: 1rem;
    }
`;

const Text = styled.div`
    font-size: 1rem;
    color: #5F5F5F;
    margin-bottom: 0.25rem;
    alignItems: center;
`;

// rest 쪽에는 onChange, type, name, value, placeholder 등의 input 에서 사용 하는 값들을 넣어줄수 있다.
const AuthText = ({context}) => (
    <Wrapper>
        <Text>{context}</Text>
    </Wrapper>
);

export default AuthText;