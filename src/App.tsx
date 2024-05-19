import React, {
  ChangeEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import styled, { css } from "styled-components";
import Table from "./components/Table";
import Clock from "react-live-clock";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  CardFromText,
  DropDown,
  Input,
  RadioBox,
  RadioLabel,
} from "./components/atom";
import Toggle from "./components/common/Toggle";
import Countdown from "react-countdown";
import {
  getLocalDDayDataList,
  getLocalSettingData,
  getLocalStatus,
  getLocalTimeTableDataList,
  saveLocalDDayDataList,
  saveLocalStatus,
  saveLocalTimeTableDataList,
  updateLocalSettingData,
} from "./util/local";
import Swal from "sweetalert2";
import { color } from "./components/theme";
import { calculateTimeDifferenceInMinutes, isNow } from "./util/calcTimeDiff";
import Timer from "./components/Timer";
import TimeTableComponent from "./components/TimeTableComponent";
import DDday from "./components/DDday";

function App() {
  const tempColor = "#E7E0D8";

  // 테이블 테이터 ===================================================================
  const [timetableList, setTimetableList] = useState<any>([]);
  const [dDayList, setDDayList] = useState<any>([]);
  const [settingData, setSettingData] = useState<any>([]);
  const [status, setStatus] = useState(getLocalStatus() || "");

  const [readOnlyTimeTable, setReadOnlyTimeTable] = useState([]);
  const [readOnlyDDay, setReadOnlyDDay] = useState([]);

  // console.log("타임테이블", timetableList);
  // console.log("디데이", dDayList);

  const handleAddNewTimeTableRow = () => {
    setTimetableList((prev: any) => [
      ...prev,
      { session: "", startTime: "", endTime: "", color: false },
    ]);
  };

  const handleAddNewDDayRow = () => {
    setDDayList((prev: any) => [
      ...prev,
      { id: prev.length + 1, testName: "", testDate: "" },
    ]);
  };

  const handleChangeTimePicker = (date: any, index: number, name: string) => {
    // console.log("날짜 찍어보기", date, index, name);
    const newDate = timetableList.map((item: any, idx: number) => {
      if (index === idx) {
        return {
          ...item,
          [name]: `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`,
        };
      } else {
        return item;
      }
    });
    setTimetableList(newDate);
  };

  const handleChangeDatePicker = (date: any, index: number, name: string) => {
    // console.log("날짜 찍어보기", date, index, name);
    const newDate = dDayList.map((item: any, idx: number) => {
      if (index === idx) {
        return {
          ...item,
          [name]: date.toISOString().slice(0, 10),
        };
      } else {
        return item;
      }
    });
    setDDayList(newDate);
  };

  const validTimeChecker = (timetableList: any) => {
    let lateThanPrevEndTime = true;
    timetableList.forEach((item: any, index: number) => {
      if (index === 0) return;
      if (
        Number(item.startTime.replace(":", "")) >
          Number(timetableList[index - 1].endTime.replace(":", "")) ||
        (timetableList[index - 1].endTime.slice(0, 2) === "23" &&
          item.startTime.slice(0, 2) === "00")
      ) {
        return;
      } else {
        return (lateThanPrevEndTime = false);
      }
    });

    if (!lateThanPrevEndTime) {
      Swal.fire({
        text: "시작 시간은 이전 교시의 종료 시간보다 늦거나 같을 수 없어요.",
        icon: "warning",
        timer: 3000,
      });
      return lateThanPrevEndTime;
    }

    let lateThanStartTime = true;
    timetableList.forEach((item: any, index: number) => {
      if (
        Number(item.startTime.replace(":", "")) <
          Number(item.endTime.replace(":", "")) ||
        (item.endTime.slice(0, 2) === "00" &&
          item.startTime.slice(0, 2) === "23")
      ) {
        return;
      } else {
        return (lateThanStartTime = false);
      }
    });

    if (!lateThanStartTime) {
      Swal.fire({
        text: "종료 시간은 해당 교시의 시작 시간보다 빠를 수 없어요.",
        icon: "warning",
        timer: 3000,
      });
      return lateThanStartTime;
    }

    return lateThanPrevEndTime && lateThanStartTime;
  };

  const emptyValueChecker = (timetableList: any) => {
    let result = true;
    timetableList.forEach((item: any, index: number) => {
      // console.log(Object.values(item));

      Object.values(item).forEach((value) => {
        if (typeof value !== "boolean" && (!value || value === "선택")) {
          return (result = false);
        } else {
          return;
        }
      });
    });

    if (!result) {
      Swal.fire({
        text: "모든 값을 입력해주세요.",
        icon: "warning",
        timer: 2000,
      });
      return result;
    }

    return result;
  };

  const handleSaveTimeTable = () => {
    if (emptyValueChecker(timetableList) && validTimeChecker(timetableList)) {
      saveLocalTimeTableDataList(timetableList);
      getReadOnlyTimeTableDataList();
      Swal.fire({
        text: "저장을 완료했어요.",
        icon: "success",
        timer: 2000,
      });
    }
  };

  const handleSaveDDay = () => {
    if (emptyValueChecker(timetableList)) {
      saveLocalDDayDataList(dDayList);
      getReadOnlyDDayDataList();
      Swal.fire({
        text: "저장을 완료했어요.",
        icon: "success",
        timer: 2000,
      });
    }
  };

  const handleResetTimeTable = () => {
    return setTimetableList([]);
  };

  const handleResetDDay = () => {
    return setDDayList([]);
  };

  const handleInitTimeTable = () => {
    return setTimetableList(readOnlyTimeTable);
  };

  const handleInitDDay = () => {
    return setDDayList(readOnlyDDay);
  };

  const handleDeleteTimeTableRow = (index: number) => {
    setTimetableList(
      timetableList.filter((item: any, idx: number) => index !== idx)
    );
  };

  const handleDeleteDDayRow = (index: number) => {
    setDDayList(dDayList.filter((item: any, idx: number) => index !== idx));
  };

  const TIME_TABLE_COLUMN_LIST = [
    { accessor: "session", text: "교시", width: "5rem" },
    { accessor: "startTime", text: "시작 시간", width: "7rem" },
    { accessor: "endTime", text: "종료 시간", width: "7rem" },
    { accessor: "color", text: "강조", width: "3rem" },
    { accessor: "deleteBtn", text: "", width: "3rem" },
  ];

  const DDay_COLUMN_LIST = [
    { accessor: "id", text: "순번", width: "3rem" },
    { accessor: "testName", text: "시험명", width: "13rem" },
    { accessor: "testDate", text: "시험날짜", width: "7rem" },
    { accessor: "deleteBtn", text: "", width: "3rem" },
  ];

  // console.log("디데이 확인", dDayList);

  const sessionOptionList = [
    "선택",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "L",
    "D",
  ];

  const timeTableTableDataList = timetableList.map(
    (data: any, index: number) => ({
      ...data,
      session: (
        <DropDown
          // disabled={disabled}
          style={{ margin: 0, width: 80, height: 30, padding: "0" }}
          // width="70px"
          value={timetableList[index].session}
          onChange={(e) =>
            setTimetableList((prev: any) =>
              prev.map((item: any, idx: number) =>
                idx === index ? { ...item, session: e.target.value } : item
              )
            )
          }
        >
          {sessionOptionList.map((item, idx) => (
            <option key={idx} value={item} style={{ textAlign: "center" }}>
              {item}
            </option>
          ))}
        </DropDown>
      ),
      startTime: (
        <StyledDatePicker
          selected={new Date()}
          onChange={(date) => handleChangeTimePicker(date, index, "startTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          placeholderText="HH:mm"
          value={timetableList[index].startTime}
        />
      ),
      endTime: (
        <StyledDatePicker
          selected={new Date()}
          onChange={(date) => handleChangeTimePicker(date, index, "endTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          placeholderText="HH:mm"
          value={timetableList[index].endTime}
        />
      ),
      color: (
        <input
          type="checkBox"
          checked={timetableList[index].color}
          onChange={(e) =>
            setTimetableList((prev: any) =>
              prev.map((item: any, idx: number) =>
                idx === index ? { ...item, color: e.target.checked } : item
              )
            )
          }
        />
      ),
      deleteBtn: (
        <Button onClick={() => handleDeleteTimeTableRow(index)}>삭제</Button>
      ),
    })
  );

  const dDayTableDataList = dDayList.map((data: any, index: number) => ({
    ...data,
    testName: (
      <Input
        type="string"
        value={dDayList[index].testName}
        onChange={(e) =>
          setDDayList((prev: any) =>
            prev.map((item: any, idx: number) =>
              idx === index ? { ...item, testName: e.target.value } : item
            )
          )
        }
      />
    ),
    testDate: (
      <StyledDatePicker
        selected={new Date()}
        value={dDayList[index].testDate}
        onChange={(date) => handleChangeDatePicker(date, index, "testDate")}
        locale="ko-KR"
        dateFormat="yyyy/MM/dd"
        placeholderText="yyyy/MM/dd"
      />
    ),

    deleteBtn: <Button onClick={() => handleDeleteDDayRow(index)}>삭제</Button>,
  }));

  // CSS 세팅 ======================================================================
  const initialSizeState = {
    // 추후 로컬 스토리지데이터로 교체
    sideBar: { width: 200 },
    dateAndStatus: { width: 180, height: 110, gap: 1 },
    timeTable: { width: 180, height: 300, gap: 1 },
    currentTime: { width: 180, height: 70, gap: 1 },
    video: { width: 180, height: 80, gap: 1 },
    dDay: { width: 180, height: 140, gap: 3 },
  };

  const [displaySize, setDisplaySize] = useState(initialSizeState);

  const todayDate = moment().format("MMM D ddd");

  const handleLazeChange = (e: TouchEvent<HTMLInputElement>) => {
    console.log("뭐노", e);
  };

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, name, valueAsNumber } = e?.target;

    console.log("뭐", id, name, valueAsNumber);

    setDisplaySize((prev) => ({
      ...prev,
      // @ts-ignore
      [id]: { ...prev[id], [name]: valueAsNumber },
    }));
  };

  const [areavisible, setAreavisible] = useState<boolean>(false);

  //=================

  const zeroPad = (number: number) => {
    return number.toString().padStart(2, "0");
  };

  function formatTimestampToTime(timestamp: number) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  ///===================

  useEffect(() => {
    const timeTableRes = getLocalTimeTableDataList();
    if (!timeTableRes) {
      saveLocalTimeTableDataList([]);
    } else {
      setTimetableList(timeTableRes);
    }

    const dDayTableRes = getLocalDDayDataList();
    if (!dDayTableRes) {
      saveLocalDDayDataList([]);
    } else {
      setDDayList(dDayTableRes);
    }
    const getSettingRes = getLocalSettingData();
    if (!getSettingRes) {
      updateLocalSettingData({});
    } else {
      setSettingData(getSettingRes);
    }
  }, []);

  // 읽기 전용 데이타 페칭
  const getReadOnlyTimeTableDataList = () => {
    const timeTableRes = getLocalTimeTableDataList();
    setReadOnlyTimeTable(timeTableRes);
  };

  const getReadOnlyDDayDataList = () => {
    const dDayRes = getLocalDDayDataList();
    setReadOnlyDDay(dDayRes);
  };

  useEffect(() => {
    getReadOnlyTimeTableDataList();
    getReadOnlyDDayDataList();
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());
  const requestRef = useRef<number>();

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [timerVisible, setTimerVisible] = useState(true);

  return (
    <Main>
      <Inner>
        <DisplaySection
          width={displaySize?.sideBar?.width}
          primarycolor={tempColor}
        >
          <DateAndStatusWrapper
            width={displaySize?.dateAndStatus?.width}
            height={displaySize?.dateAndStatus?.height}
            gap={displaySize?.dateAndStatus?.gap}
            areavisible={areavisible}
          >
            <DisplayTitle>[Current status]</DisplayTitle>
            <DateText>{todayDate}</DateText>
            <StatusText>{status}</StatusText>
          </DateAndStatusWrapper>
          <TimeTableComponent
            displaySize={displaySize}
            areavisible={areavisible}
            readOnlyTimeTable={readOnlyTimeTable}
          />
          {/* <TimeTableWrapper
            width={displaySize?.timeTable?.width}
            height={displaySize?.timeTable?.height}
            gap={displaySize?.timeTable?.gap}
            areavisible={areavisible}
          >
            {readOnlyTimeTable.map((item: any, idx: number) => (
              <TimeTableRow
                now={isNow(item.startTime, item.endTime, currentTime)}
                meal={item.color}
                key={idx}
              >
                {item.session}. {item.startTime} ~ {item.endTime} (
                {calculateTimeDifferenceInMinutes(item.startTime, item.endTime)}
                ')
              </TimeTableRow>
            ))}
          </TimeTableWrapper> */}
          <CurrentTimeWrapper
            width={displaySize?.currentTime?.width}
            height={displaySize?.currentTime?.height}
            gap={displaySize?.currentTime?.gap}
            areavisible={areavisible}
          >
            <DisplayTitle>[Current time]</DisplayTitle>
            <TimeText>
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </TimeText>
          </CurrentTimeWrapper>
          <VideoWrapper
            width={displaySize?.video?.width}
            height={displaySize?.video?.height}
            areavisible={areavisible}
          >
            비디오 영역
          </VideoWrapper>
          <DDayWrapper
            width={displaySize?.dDay?.width}
            height={displaySize?.dDay?.height}
            gap={displaySize?.dDay?.gap}
            areavisible={areavisible}
          >
            <DisplayTitle>[D-day]</DisplayTitle>
            <DDday readOnlyDDay={readOnlyDDay} />
          </DDayWrapper>
        </DisplaySection>
        <ControllerSection>
          <LeftBox>
            {/* <AreaContainer className="outline">
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
            </AreaContainer> */}
            <AreaContainer className="outline">
              <AreaTitle>수업 시간 타이머</AreaTitle>
              <AreaContent className="row">
                <Timer
                  readOnlyTimeTable={readOnlyTimeTable}
                  timerVisible={timerVisible}
                />

                {/* <Countdown date={Date.now() + 5000} renderer={renderer} /> */}
                <ToggleList>
                  {/* <label htmlFor="autoStartSessionTimer">
                    <Toggle
                      state={todoInfo?.isActiveRangeToggle}
                      setState={setIsActiveRangeToggle}
                    />
                    <span>자동 실행 ON/OFF</span>
                    <input type="checkBox" id="autoStartSessionTimer" />
                  </label> */}
                  <label htmlFor="autoStartSessionTimer">
                    {/* <Toggle
                      state={todoInfo?.isActiveRangeToggle}
                      setState={setIsActiveRangeToggle}
                    /> */}
                    <span>보이기/숨기기</span>
                    <input
                      type="checkBox"
                      checked={timerVisible}
                      onChange={(e) => setTimerVisible(e.target.checked)}
                      id="autoStartSessionTimer"
                    />
                  </label>
                  {/* <ManualStartForm>
                    <p>수동 실행</p>
                    <ManualStartWrapper>
                      <ManualStartInput type="number" /> <span>:</span>
                      <ManualStartInput type="number" /> <span>:</span>
                      <ManualStartInput type="number" />
                    </ManualStartWrapper>
                    <ManualStartWrapper>
                      <Button>초기화</Button>
                      <Button>일시 정지</Button>
                      <Button type="submit">수동 시작</Button>
                    </ManualStartWrapper>
                  </ManualStartForm> */}
                </ToggleList>
              </AreaContent>
            </AreaContainer>
            <AreaContainer className="outline">
              <AreaTitle>현재 상태 설정</AreaTitle>
              <AreaContent className="row">
                <div>
                  <RadioLabel htmlFor="live">
                    <RadioBox
                      type="radio"
                      name="status"
                      id="live"
                      checked={status === "LIVE"}
                      onChange={(e) => {
                        setStatus("LIVE");
                        saveLocalStatus("LIVE");
                      }}
                    />
                    <CardFromText>LIVE</CardFromText>
                  </RadioLabel>
                  <RadioLabel htmlFor="meal">
                    <RadioBox
                      type="radio"
                      name="status"
                      id="meal"
                      checked={status === "Meal Time"}
                      onChange={(e) => {
                        setStatus("Meal Time");
                        saveLocalStatus("Meal Time");
                      }}
                    />
                    <CardFromText>Meal Time</CardFromText>
                  </RadioLabel>
                </div>
                <div>
                  <RadioLabel htmlFor="recorded">
                    <RadioBox
                      type="radio"
                      name="status"
                      id="recorded"
                      checked={status === "24/7"}
                      onChange={(e) => {
                        setStatus("24/7");
                        saveLocalStatus("24/7");
                      }}
                    />
                    <CardFromText>24/7</CardFromText>
                  </RadioLabel>
                  <RadioLabel htmlFor="shower">
                    <RadioBox
                      type="radio"
                      name="status"
                      id="shower"
                      checked={status === "Shower Room"}
                      onChange={(e) => {
                        setStatus("Shower Room");
                        saveLocalStatus("Shower Room");
                      }}
                    />
                    <CardFromText>Shower Room</CardFromText>
                  </RadioLabel>
                </div>
              </AreaContent>
            </AreaContainer>
            {/* <AreaContainer className="outline">
              <AreaTitle>색상 설정</AreaTitle>
              <AreaContent className="row">
                <span>배경색</span>
                <span>글자색1</span>
                <span>글자색2</span>
              </AreaContent>
            </AreaContainer> */}
            <AreaContainer className="outline">
              <AreaTitle>사이드 바 너비</AreaTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.sideBar?.width} //보류
                  // data-id="sideBar"
                  // name="width"
                  // onTouchEnd={handleLazeChange}
                />
              </AreaContent>
              <AreaTitle>영역별 사이즈 조절</AreaTitle>
              <label htmlFor="areavisible">
                <span>영역보기</span>
                <input
                  id="areavisible"
                  type="checkBox"
                  checked={areavisible}
                  onChange={(e) => setAreavisible(e.target.checked)}
                />
              </label>
              <AreaSubTitle>날짜 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.dateAndStatus?.width}
                  id="dateAndStatus"
                  name="width"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.dateAndStatus?.height}
                  id="dateAndStatus"
                  name="height"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySize?.dateAndStatus?.gap}
                  id="dateAndStatus"
                  name="gap"
                  onChange={handleChangeSize}
                />
              </AreaContent>
              <AreaSubTitle>시간표 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.timeTable?.width}
                  id="timeTable"
                  name="width"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.timeTable?.height}
                  id="timeTable"
                  name="height"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySize?.timeTable?.gap}
                  id="timeTable"
                  name="gap"
                  onChange={handleChangeSize}
                />
              </AreaContent>
              <AreaSubTitle>현재 시간 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.currentTime?.width}
                  id="currentTime"
                  name="width"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.currentTime?.height}
                  id="currentTime"
                  name="height"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySize?.currentTime?.gap}
                  id="currentTime"
                  name="gap"
                  onChange={handleChangeSize}
                />
              </AreaContent>
              <AreaSubTitle>비디오 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.video?.width}
                  id="video"
                  name="width"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.video?.height}
                  id="video"
                  name="height"
                  onChange={handleChangeSize}
                />
              </AreaContent>
              <AreaSubTitle>디데이 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.dDay?.width}
                  id="dDay"
                  name="width"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySize?.dDay?.height}
                  id="dDay"
                  name="height"
                  onChange={handleChangeSize}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySize?.dDay?.gap}
                  id="dDay"
                  name="gap"
                  onChange={handleChangeSize}
                />
              </AreaContent>
            </AreaContainer>
          </LeftBox>
          <RightBox>
            <AreaContainer className="outline">
              <AreaTitle>시간표 설정</AreaTitle>
              <AreaContent>
                <Table
                  columnList={TIME_TABLE_COLUMN_LIST}
                  dataList={timeTableTableDataList}
                  onAddRow={handleAddNewTimeTableRow}
                  onReset={handleResetTimeTable}
                  onInit={handleInitTimeTable}
                  onSave={handleSaveTimeTable}
                />
              </AreaContent>
            </AreaContainer>
            <AreaContainer className="outline">
              <AreaTitle>디데이 설정</AreaTitle>
              <AreaContent>
                <Table
                  columnList={DDay_COLUMN_LIST}
                  dataList={dDayTableDataList}
                  onAddRow={handleAddNewDDayRow}
                  onReset={handleResetDDay}
                  onInit={handleInitDDay}
                  onSave={handleSaveDDay}
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
  background-color: #c7c7c7;
  /* background-color: red; */
`;

const Inner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  /* background-color: pink; */
  display: flex;
  gap: 1rem;
`;

const DisplaySection = styled.section<{ width: number; primarycolor: string }>`
  background-color: ${(props) => props.primarycolor};
  width: ${(props) => props.width}px;
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5rem; // 추후 동적으로 설정
  margin: 10px 0;

  p {
    margin: 0;
  }

  border-radius: 30px;
  box-shadow: 0 6px 20px -15px #000;
  border-width: 1px 1px 0 0;
  border-color: #fff;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.5);

  &::before {
    width: 560px;
    height: 300px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.25); /* 밝게 보이도록 배경색 추가 */
    border-radius: 30px; /* 둥근 테두리 */
    box-shadow: 0 6px 20px -15px #000; /* 그림자 효과 */
    border-width: 1px 1px 0 0; /* 입체감 흰색 테두리 */
    border-color: #fff;
    border-style: solid;
  }
`;

const ControllerSection = styled.section`
  background-color: #fff;
  height: calc(100% - 20px);
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 10px 0;
  padding: 1rem;
  box-sizing: border-box;

  border-radius: 30px;
  box-shadow: 0 6px 20px -15px #000;
  border-width: 1px 1px 0 0;
  border-color: #fff;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.5);

  &::before {
    width: 560px;
    height: 300px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.25); /* 밝게 보이도록 배경색 추가 */
    border-radius: 30px; /* 둥근 테두리 */
    box-shadow: 0 6px 20px -15px #000; /* 그림자 효과 */
    border-width: 1px 1px 0 0; /* 입체감 흰색 테두리 */
    border-color: #fff;
    border-style: solid;
  }
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

const AreaContainer = styled.div<{ primarycolor?: string }>`
  /* background-color: aliceblue; */
  display: flex;
  flex-direction: column;
  padding: 1rem;

  &.outline {
    /* border: 0.5px solid ${(props) => props.primarycolor}; */
    border-radius: 1rem;
    background-color: #f5f5f5;
  }
`;

const AreaTitle = styled.p`
  margin: 0;
  /* background-color: red; */
  font-size: 1rem;
  font-weight: 600;
`;

const AreaSubTitle = styled.p`
  margin: 0;
  /* background-color: red; */
  font-size: 0.8rem;
  font-weight: 400;
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

const ManualStartInput = styled(Input)`
  width: 40px;
  text-align: center;
`;

const DateAndStatusWrapper = styled.div<{
  width?: number;
  height?: number;
  gap?: number;
  areavisible: boolean;
}>`
  background-color: #${(props) => (props.areavisible ? "507788" : "")};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;
// const TimeTableWrapper = styled.div<{
//   width?: number;
//   height?: number;
//   gap?: number;
//   areavisible: boolean;
// }>`
//   background-color: #${(props) => (props.areavisible ? "507788" : "")};
//   width: ${(props) => props.width}px;
//   height: ${(props) => props.height}px;
//   display: flex;
//   flex-direction: column;
//   gap: ${(props) => props.gap}px;
//   justify-content: center;
//   align-items: center;
//   border-radius: 0.5rem;
// `;
const CurrentTimeWrapper = styled.div<{
  width?: number;
  height?: number;
  gap?: number;
  areavisible: boolean;
}>`
  background-color: #${(props) => (props.areavisible ? "507788" : "")};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;
const VideoWrapper = styled.div<{
  width?: number;
  height?: number;
  areavisible: boolean;
}>`
  background-color: #${(props) => (props.areavisible ? "507788" : "")};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;
const DDayWrapper = styled.div<{
  width?: number;
  height?: number;
  gap?: number;
  areavisible: boolean;
}>`
  background-color: #${(props) => (props.areavisible ? "507788" : "")};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;

const StyledDatePicker = styled(DatePicker)`
  text-align: center;
  width: 5rem;

  padding: 6px 8px;
  background: #f8fcff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  /* margin: 8px 7px 8px 15px; */
  :disabled {
    color: #cfcfcf;
  }

  &:hover {
    filter: brightness(0.98);
  }
`;

const StyledInput = styled(Input)`
  width: 2rem;
  text-align: center;
`;

// const TimeTableRow = styled.p<{ now: boolean; meal: boolean }>`
//   font-size: 0.8rem;
//   padding: 0 0.5rem;
//   border-radius: 1rem;
//   font-weight: 700;
//   ${(props) =>
//     props.now &&
//     css`
//       background-color: #ff31312e;
//     `}

// ${(props) =>
//   props.meal &&
//   css`
//     color: #ee4f36;
//   `}
// `;

const DisplayTitle = styled.p`
  margin: 0;
  font-weight: 900;
  font-size: 0.8rem;
`;

const DateText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
`;

const StatusText = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  color: #ee4f36;
`;

const TimeText = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
`;
