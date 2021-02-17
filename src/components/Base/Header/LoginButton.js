import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { shadow } from "../../../lib/styleUtil";

const BorderedButton = styled(Link)`
  font-weight: 600;
  color: #666d75;
  border: 1px solid #66d75;
  padding: 0.5rem;
  padding-bottom: 0.4rem;
  cursor: pointer;
  border-radius: 2px;
  text-decoration: none;
  transition: 0.2s all;

  &:hover {
    background: #ffc043;
    color: white;
    ${shadow(1)}
  }

  &:active {
    /* 마우스 클릭시 아래로 미세하게 움직임 */
    transform: translateY(3px);
  }
`;

const LoginButton = () => (
  <BorderedButton to="/auth/login">로그인</BorderedButton>
);

export default LoginButton;
