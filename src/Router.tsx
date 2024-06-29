import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Timer from "./components/Timer";
import DayTime from "./pages/DayTime";
import NightTime from "./pages/NightTime";
import CommonSetting from "./pages/CommonSetting";
import DayTimer from "./pages/DayTimer";
import NightTimer from "./pages/NightTimer";
import Header from "./components/common/Header";
import styled from "styled-components";
import TestTime from "./pages/TestTime";
import TestTimer from "./pages/TestTimer";
import AllDayTime from "./pages/AllDayTime";
import AllDayTimer from "./pages/AllDayTimer";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Inner>
          <Routes>
            <Route path="/" element={<Navigate to="/daytime" />} />
            <Route path="/daytime" element={<DayTime />} />
            <Route path="/nighttime" element={<NightTime />} />
            <Route path="/daytimer" element={<DayTimer />} />
            <Route path="/nighttimer" element={<NightTimer />} />
            <Route path="/alldaytime" element={<AllDayTime />} />
            <Route path="/alldaytimer" element={<AllDayTimer />} />
            <Route path="/setting" element={<CommonSetting />} />
            <Route path="/testtime" element={<TestTime />} />
            <Route path="/testtimer" element={<TestTimer />} />
          </Routes>
        </Inner>
      </Main>
    </BrowserRouter>
  );
};

export default Router;

const Main = styled.main`
  box-sizing: border-box;
  height: calc(100dvh - 2.4rem);

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
    height: auto;
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  /* background-color: pink; */
  display: flex;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
  }
`;
