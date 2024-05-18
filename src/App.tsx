import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import Table from "./components/Table";

function App() {
  const tempWidth = 200;
  const tempColor = "green";

  const TIME_TABLE_COLUMN_LIST = [
    { accessor: "session", text: "교시", width: "3rem" },
    { accessor: "startTime", text: "시작 시간", width: "10rem" },
    { accessor: "endTime", text: "종료 시간", width: "10rem" },
    { accessor: "deleteBtn", text: "-", width: "3rem" },
  ];

  const DDay_COLUMN_LIST = [
    { accessor: "id", text: "순번", width: "3rem" },
    { accessor: "testName", text: "시험명", width: "13rem" },
    { accessor: "testDate", text: "시험날짜", width: "7rem" },
    { accessor: "deleteBtn", text: "-", width: "3rem" },
  ];

  const tempOriginTimeTableDataList = [
    { session: "1", startTime: "12", endTime: "34" },
    { session: "2", startTime: "56", endTime: "78" },
    { session: "3", startTime: "910", endTime: "1112" },
  ];

  const tempOriginDDayDataList = [
    { id: "1", testName: "정보처리기사", testDate: "34" },
    { id: "2", testName: "감정평가사", testDate: "78" },
    { id: "3", testName: "정보보안기사", testDate: "1112" },
  ];

  const timeTableTableDataList = tempOriginTimeTableDataList.map((data) => ({
    ...data,
    deleteBtn: <button>삭제</button>,
  }));

  const dDayTableDataList = tempOriginDDayDataList.map((data) => ({
    ...data,
    deleteBtn: <button>삭제</button>,
  }));

  return (
    <Main>
      <Inner>
        <DisplaySection
          width={tempWidth}
          primaryColor={tempColor}
        ></DisplaySection>
        <ControllerSection>
          <LeftBox>
            <AreaContainer>
              <AreaTitle>잔여 쉬는 시간 표시</AreaTitle>
              <AreaContent>
                <p>{"Break Time - 02:10"}</p>
                <ToggleList>
                  <label htmlFor="autoStartBreakTimer">
                    <span>시간표에 맞춰 자동 실행</span>
                    <input type="checkBox" id="autoStartBreakTimer" />
                  </label>
                  <label>
                    <span>입체 효과 활성화 (시계 위 최적화)</span>
                    <input type="checkBox" />
                  </label>
                </ToggleList>
              </AreaContent>
            </AreaContainer>
            <AreaContainer>
              <AreaTitle>수업 시간 타이머</AreaTitle>
              <AreaContent className="row">
                <TempTimerArea>타이머 영역</TempTimerArea>
                <ToggleList>
                  <label htmlFor="autoStartSessionTimer">
                    <span>시간표에 맞춰 자동 실행</span>
                    <input type="checkBox" id="autoStartSessionTimer" />
                  </label>
                  <ManualStartForm>
                    <p>수동 실행</p>
                    <ManualStartWrapper>
                      <ManualStartInput type="number" /> <span>:</span>
                      <ManualStartInput type="number" /> <span>:</span>
                      <ManualStartInput type="number" />
                    </ManualStartWrapper>
                    <ManualStartWrapper>
                      <button>초기화</button>
                      <button>일시 정지</button>
                      <button type="submit">수동 시작</button>
                    </ManualStartWrapper>
                  </ManualStartForm>
                </ToggleList>
              </AreaContent>
            </AreaContainer>
            <AreaContainer>
              <AreaTitle>현재 상태 설정</AreaTitle>
              <AreaContent className="row">
                <label htmlFor="live">
                  <input type="radio" name="status" id="live" />
                  <span>LIVE</span>
                </label>
                <label htmlFor="meal">
                  <input type="radio" name="status" id="meal" />
                  <span>Meal Time</span>
                </label>
                <label htmlFor="shower">
                  <input type="radio" name="status" id="shower" />
                  <span>Shower Room</span>
                </label>
                <label htmlFor="recorded">
                  <input type="radio" name="status" id="recorded" />
                  <span>24/7</span>
                </label>
              </AreaContent>
            </AreaContainer>
            <AreaContainer className="outline">
              <AreaTitle>테마 설정</AreaTitle>
              <AreaContent className="row">
                <label htmlFor="ver1">
                  <input type="radio" name="theme" id="ver1" />
                  <span>버전1</span>
                </label>
                <label htmlFor="ver2">
                  <input type="radio" name="theme" id="ver2" />
                  <span>버전2</span>
                </label>
              </AreaContent>
              <AreaTitle>색상 설정</AreaTitle>
              <AreaContent className="row">
                <span>배경색</span>
                <span>글자색1</span>
                <span>글자색2</span>
              </AreaContent>
            </AreaContainer>
            <AreaContainer className="outline">
              <AreaTitle>사이드 바 너비</AreaTitle>
              <AreaContent className="row"></AreaContent>
              <AreaTitle>비디오 영역 사이즈 조절</AreaTitle>
              <AreaContent className="row"></AreaContent>
            </AreaContainer>
          </LeftBox>
          <RightBox>
            <AreaContainer className="outline">
              <AreaTitle>시간표 설정</AreaTitle>
              <AreaContent>
                <Table
                  columnList={TIME_TABLE_COLUMN_LIST}
                  dataList={timeTableTableDataList}
                />
              </AreaContent>
            </AreaContainer>
            <AreaContainer className="outline">
              <AreaTitle>디데이 설정</AreaTitle>
              <AreaContent>
                <Table
                  columnList={DDay_COLUMN_LIST}
                  dataList={dDayTableDataList}
                />
              </AreaContent>
            </AreaContainer>
          </RightBox>
        </ControllerSection>
      </Inner>
    </Main>
  );
}

export default App;

const Main = styled.main`
  height: 100vh;
  /* background-color: red; */
`;

const Inner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  /* background-color: pink; */
  display: flex;
`;

const DisplaySection = styled.section<{ width: number; primaryColor: string }>`
  background-color: ${(props) => props.primaryColor};
  width: ${(props) => props.width}px;
  height: 100%;
`;

const ControllerSection = styled.section`
  /* background-color: blue; */
  height: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const LeftBox = styled.div`
  height: 100%;
  /* background-color: purple; */
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const RightBox = styled.div`
  height: 100%;
  /* background-color: yellow; */
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const AreaContainer = styled.div<{ primaryColor?: string }>`
  /* background-color: aliceblue; */
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  &.outline {
    border: 0.5px solid ${(props) => props.primaryColor};
    border-radius: 1rem;
  }
`;

const AreaTitle = styled.p`
  margin: 0;
  /* background-color: red; */
  font-size: 1rem;
  font-weight: 600;
`;

const AreaContent = styled.div`
  /* background-color: blue; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;

  &.row {
    flex-direction: row;
  }
`;

const ToggleList = styled.div`
  display: flex;
  flex-direction: column;

  > label {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  gap: 0.5rem;
`;

const ManualStartForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ManualStartWrapper = styled.div`
  display: flex;
  gap: 0.5rem;

  > span {
    line-height: 1rem;
  }
`;

const TempTimerArea = styled.div`
  width: 10rem;
  height: 10rem;
  background-color: orange;
`;

const ManualStartInput = styled.input`
  width: 40px;
`;
