import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  const mark = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? "700" : "400",
  });

  return (
    <Container>
      <div>
        <StyledNavLink to="/daytime" style={mark}>
          주간 시간표
        </StyledNavLink>
        <StyledNavLink to="/nighttime" style={mark}>
          야간 시간표
        </StyledNavLink>
        <StyledNavLink to="/daytimer" style={mark}>
          주간 타이머
        </StyledNavLink>
        <StyledNavLink to="/nighttimer" style={mark}>
          야간 타이머
        </StyledNavLink>
        <StyledNavLink to="/setting" style={mark}>
          디데이 설정
        </StyledNavLink>
      </div>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100dwh;
  height: 2.4rem;
  background-color: #dfdfdf;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 30rem;
    display: flex;
    justify-content: space-around;
  }
`;

const StyledNavLink = styled(NavLink)`
  white-space: nowrap;
  text-decoration: none;
  color: #353535;
`;
