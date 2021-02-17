import React from "react";
import styled from "styled-components";
import { shadow, media } from "../../../lib/styleUtil";
import logoImg from "../../../assets/glokool-logo@3x.png";

// header 상단 고정, 그림자
const Positioner = styled.div`
  flex-direction: column;
  position: fixed;
  width: 100%;
  z-index: 1000;
`;

// 흰 배경, 내용 중간 정렬
const WhiteBackground = styled.div`
  width: 100%;
  background: #ffd853;
  display: flex;
  justify-content: center;
  height: auto;
`;

// 해더의 내용
const HeaderContents = styled.div`
  width: 1400px;
  height: 65px;
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-right: 1rem;
  padding-left: 1rem;
  ${media.wide`
        width: 992px;
    `}

  ${media.tablet`
        width: 100%;
    `}
`;

// 로고
const Logo = styled.div`
  //   width: 100%;
  padding: 0 100px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 중간 여백
const Spacer = styled.div`
  flex-grow: 1;
`;

// 하단 그래디언트 테두리
const GradientBorder = styled.div`
  width: 100%;
  height: 3px;
  background: #707070;
`;

const LogoStyle = {
  height: "20px",
  width: "129px",
};

const Header = ({ children }) => {
  return (
    <Positioner>
      <WhiteBackground>
        <HeaderContents>
          <Logo>
            <a href="/">
              <img src={logoImg} alt="" style={LogoStyle} />
            </a>
          </Logo>
          <Spacer />
          {children}
        </HeaderContents>
      </WhiteBackground>
      <GradientBorder />
    </Positioner>
  );
};

export default Header;
