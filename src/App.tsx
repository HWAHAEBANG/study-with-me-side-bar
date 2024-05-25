import React, {
  ChangeEvent,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import styled, { css } from "styled-components";
import Table from "./components/Table";
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
import Swal from "sweetalert2";
import Timer from "./components/Timer";
import TimeTableComponent from "./components/TimeTableComponent";
import DDday from "./components/DDday";
import {
  getFirebaseDDayDataList,
  getFirebaseTimeTableDataList,
  getFirebaseSettingData,
  getFirebaseStatusData,
  saveFirebaseDDayDataList,
  saveFirebaseTimeTableDataList,
  saveFirebaseSettingData,
  saveFirebaseStatusData,
  getFirebaseTimerSettingData,
  saveFirebaseTimerSettingData,
  saveFirebaseTempTimerSettingData,
  getFirebaseTempTimerSettingData,
} from "./api/firebase";
import { CiMonitor } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

function App() {
  const tempColor = "#E7E0D8";

  // 테이블 테이터 ===================================================================
  const initialSizeState = {
    // 추후 로컬 스토리지데이터로 교체
    sideBar: { width: 200, tempWidth: 200 },
    dateAndStatus: { width: 180, height: 110, gap: 1 },
    timeTable: { width: 180, height: 300, gap: 1 },
    currentTime: { width: 180, height: 70, gap: 1 },
    video: { width: 180, height: 80, gap: 1 },
    dDay: { width: 180, height: 140, gap: 3 },
  };

  const [timetableList, setTimetableList] = useState<any>([]);
  const [dDayList, setDDayList] = useState<any>([]);
  const [displaySetting, setDisplaySetting] = useState<any>([]);
  const [statusData, setStatusData] = useState("");
  const [timeZone, setTimeZone] = useState<boolean>(true);

  const [readOnlyTimeTable, setReadOnlyTimeTable] = useState([]);
  const [readOnlyDDay, setReadOnlyDDay] = useState([]);

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
      saveFirebaseTimeTableDataList(timeZone, timetableList);
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
      saveFirebaseDDayDataList(dDayList);
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
    { accessor: "startTime", text: "시작 시간", width: "4rem" },
    { accessor: "endTime", text: "종료 시간", width: "4rem" },
    { accessor: "color", text: "강조", width: "3rem" },
    { accessor: "deleteBtn", text: "", width: "3rem" },
  ];

  const DDay_COLUMN_LIST = [
    { accessor: "id", text: "순번", width: "3rem" },
    { accessor: "testName", text: "시험명", width: "8rem" },
    { accessor: "testDate", text: "시험날짜", width: "6rem" },
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
    "16",
    "17",
    "18",
    "19",
    "20",
    "L",
    "D",
  ];

  const timeTableTableDataList = timetableList.map(
    (data: any, index: number) => ({
      ...data,
      session: (
        <DropDown
          // disabled={disabled}
          style={{ margin: 0, width: 60, height: 30, padding: "0" }}
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

  const dDayTableDataList = dDayList
    .sort(
      (a: any, b: any) =>
        a.testDate.replaceAll("-", "") - b.testDate.replaceAll("-", "")
    )
    .map((data: any, index: number) => ({
      ...data,
      id: index + 1,
      testName: (
        <StyledInput
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

      deleteBtn: (
        <Button onClick={() => handleDeleteDDayRow(index)}>삭제</Button>
      ),
    }));

  // CSS 세팅 ======================================================================
  const todayDate = moment().format("MMM D ddd");

  const handleChangeSize = (e: any) => {
    const { id, name, valueAsNumber } = e?.target;
    setDisplaySetting((prev: any) => ({
      ...prev,
      // @ts-ignore
      [id]: { ...prev[id], [name]: valueAsNumber },
    }));
  };

  useEffect(() => {
    if (displaySetting.length === 0) return;
    // debounce(() => saveFirebaseSettingData(displaySetting));
    saveFirebaseSettingData(timeZone, displaySetting);
  }, [displaySetting]);

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
    const getData = async () => {
      const timeTableRes = await getFirebaseTimeTableDataList(timeZone);
      setTimetableList(timeTableRes);

      const dDayTableRes = await getFirebaseDDayDataList();
      setDDayList(dDayTableRes);

      const getSettingRes = await getFirebaseSettingData(timeZone);
      console.log(timeZone, getSettingRes);

      setDisplaySetting(getSettingRes);

      const getStatusRes = await getFirebaseStatusData();
      setStatusData(getStatusRes);

      // 보류
      // const getTimerSettingRes = await getFirebaseTimerSettingData();
      // setTimerSetting(getTimerSettingRes);

      const getTempTimerSettingRes = await getFirebaseTempTimerSettingData();
      setTempTimerSetting(getTempTimerSettingRes);
    };
    getData();
  }, [timeZone]);

  // 읽기 전용 데이타 페칭
  const getReadOnlyTimeTableDataList = async () => {
    try {
      const timeTableRes = await getFirebaseTimeTableDataList(timeZone);
      setReadOnlyTimeTable(timeTableRes);
    } catch (error) {
      console.log(error);
    }
  };

  const getReadOnlyDDayDataList = async () => {
    const dDayRes = await getFirebaseDDayDataList();
    setReadOnlyDDay(dDayRes);
  };

  useEffect(() => {
    getReadOnlyTimeTableDataList();
    getReadOnlyDDayDataList();
  }, [timeZone]);

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
  const [bellActive, setBellActive] = useState(true);
  const [mobilePreviewBtnVisible, setMobilePreviewBtnVisible] = useState(false);

  const initTimerSet = {
    bellVolume: 100,
    textSize: 12,
    gaugeWidth: 10,
    gaugeColor: "red",
    breakText: "Break time",
  };
  const [timerSetting, setTimerSetting] = useState(initTimerSet);

  const handleChangeTimerSetting = (e: any) => {
    const { name, valueAsNumber, value } = e?.target;

    if (name === "breakText") {
      setTimerSetting((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setTimerSetting((prev: any) => ({
        ...prev,
        [name]: valueAsNumber,
      }));
    }
  };

  const [timerTempSetting, setTempTimerSetting] = useState("");

  const handleChangeTempTimerSetting = (e: any) => {
    const { value } = e?.target;
    setTempTimerSetting(value);
  };
  useEffect(() => {
    if (!timerTempSetting) return;
    saveFirebaseTempTimerSettingData(timerTempSetting);
  }, [timerTempSetting]);

  return (
    <Main>
      <MobilePreviewBtn>
        {mobilePreviewBtnVisible ? (
          <RxCross2
            fontSize={20}
            onClick={() => setMobilePreviewBtnVisible(false)}
          />
        ) : (
          <CiMonitor
            fontSize={20}
            onClick={() => setMobilePreviewBtnVisible(true)}
          />
        )}
      </MobilePreviewBtn>
      <Inner>
        <DisplaySection
          width={displaySetting?.sideBar?.width}
          mobilePreviewBtnVisible={mobilePreviewBtnVisible}
          primarycolor={tempColor}
        >
          <DateAndStatusWrapper
            width={displaySetting?.dateAndStatus?.width}
            height={displaySetting?.dateAndStatus?.height}
            gap={displaySetting?.dateAndStatus?.gap}
            areavisible={areavisible}
          >
            <DisplayTitle>[Current statusData]</DisplayTitle>
            <DateText>{todayDate}</DateText>
            <StatusText>{statusData}</StatusText>
          </DateAndStatusWrapper>
          <TimeTableComponent
            displaySetting={displaySetting}
            areavisible={areavisible}
            readOnlyTimeTable={readOnlyTimeTable}
          />
          {/* <TimeTableWrapper
            width={displaySetting?.timeTable?.width}
            height={displaySetting?.timeTable?.height}
            gap={displaySetting?.timeTable?.gap}
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
            width={displaySetting?.currentTime?.width}
            height={displaySetting?.currentTime?.height}
            gap={displaySetting?.currentTime?.gap}
            areavisible={areavisible}
          >
            <DisplayTitle>[Current time]</DisplayTitle>
            <TimeText>
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </TimeText>
          </CurrentTimeWrapper>
          <VideoWrapper
            width={displaySetting?.video?.width}
            height={displaySetting?.video?.height}
            areavisible={areavisible}
          >
            비디오 영역
          </VideoWrapper>
          <DDayWrapper
            width={displaySetting?.dDay?.width}
            height={displaySetting?.dDay?.height}
            gap={displaySetting?.dDay?.gap}
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
              <AreaContent>
                <Timer
                  readOnlyTimeTable={readOnlyTimeTable}
                  timerVisible={timerVisible}
                  activeBell={bellActive}
                  // bellVolume={timerSetting?.bellVolume}
                  // textSize={timerSetting?.textSize}
                  // gaugeWidth={timerSetting?.gaugeWidth}
                  // gaugeColor={timerSetting?.gaugeColor}
                  breackText={timerSetting?.breakText}
                  timeZone={timeZone}
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
                  <label>
                    <span>보이기/숨기기</span>
                    <Toggle state={timerVisible} setState={setTimerVisible} />
                  </label>
                  <label>
                    <span>종소리 ON/OFF</span>
                    <Toggle state={bellActive} setState={setBellActive} />
                  </label>
                  {/* <label>
                    <span> 종소리 음량 : </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={timerSetting?.bellVolume}
                      name="bellVolume"
                      onChange={handleChangeTimerSetting}
                    />
                  </label>
                  <label>
                    <span> 텍스트 크기 : </span>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={timerSetting?.textSize}
                      name="textSize"
                      onChange={handleChangeTimerSetting}
                    />
                  </label>
                  <label>
                    <span> 게이지 너비 : </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={timerSetting?.gaugeWidth}
                      name="gaugeWidth"
                      onChange={handleChangeTimerSetting}
                    />
                  </label> */}
                  <label>
                    <span> 쉬는 시간 문구 : </span>
                    <StyledInput
                      value={timerTempSetting}
                      // name="breakText"
                      onChange={handleChangeTempTimerSetting}
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
                      name="statusData"
                      id="live"
                      checked={statusData === "LIVE"}
                      onChange={(e) => {
                        setStatusData("LIVE");
                        saveFirebaseStatusData("LIVE");
                      }}
                    />
                    <CardFromText>LIVE</CardFromText>
                  </RadioLabel>
                  <RadioLabel htmlFor="meal">
                    <RadioBox
                      type="radio"
                      name="statusData"
                      id="meal"
                      checked={statusData === "Meal Time"}
                      onChange={(e) => {
                        setStatusData("Meal Time");
                        saveFirebaseStatusData("Meal Time");
                      }}
                    />
                    <CardFromText>Meal Time</CardFromText>
                  </RadioLabel>
                </div>
                <div>
                  <RadioLabel htmlFor="recorded">
                    <RadioBox
                      type="radio"
                      name="statusData"
                      id="recorded"
                      checked={statusData === "24/7"}
                      onChange={(e) => {
                        setStatusData("24/7");
                        saveFirebaseStatusData("24/7");
                      }}
                    />
                    <CardFromText>24/7</CardFromText>
                  </RadioLabel>
                  <RadioLabel htmlFor="shower">
                    <RadioBox
                      type="radio"
                      name="statusData"
                      id="shower"
                      checked={statusData === "Shower Room"}
                      onChange={(e) => {
                        setStatusData("Shower Room");
                        saveFirebaseStatusData("Shower Room");
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
              <AreaTitle>전체 너비 조절 (Only PC)</AreaTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.sideBar?.tempWidth} //보류
                  id="sideBar"
                  name="tempWidth"
                  onChange={handleChangeSize}
                  onMouseUp={() =>
                    setDisplaySetting((prev: any) => ({
                      ...prev,
                      sideBar: {
                        ...prev.sideBar,
                        width: prev?.sideBar?.tempWidth,
                      },
                    }))
                  }
                />
              </AreaContent>
              <FlexWrapper>
                <AreaTitle>영역별 사이즈 조절</AreaTitle>
              </FlexWrapper>
              <AreaSubTitle>날짜 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.dateAndStatus?.width}
                  id="dateAndStatus"
                  name="width"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.dateAndStatus?.height}
                  id="dateAndStatus"
                  name="height"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySetting?.dateAndStatus?.gap}
                  id="dateAndStatus"
                  name="gap"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
              </AreaContent>
              <AreaSubTitle>시간표 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.timeTable?.width}
                  id="timeTable"
                  name="width"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.timeTable?.height}
                  id="timeTable"
                  name="height"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySetting?.timeTable?.gap}
                  id="timeTable"
                  name="gap"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
              </AreaContent>
              <AreaSubTitle>현재 시간 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.currentTime?.width}
                  id="currentTime"
                  name="width"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.currentTime?.height}
                  id="currentTime"
                  name="height"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySetting?.currentTime?.gap}
                  id="currentTime"
                  name="gap"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
              </AreaContent>
              <AreaSubTitle>비디오 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.video?.width}
                  id="video"
                  name="width"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.video?.height}
                  id="video"
                  name="height"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
              </AreaContent>
              <AreaSubTitle>디데이 영역</AreaSubTitle>
              <AreaContent className="row">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.dDay?.width}
                  id="dDay"
                  name="width"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={displaySetting?.dDay?.height}
                  id="dDay"
                  name="height"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={displaySetting?.dDay?.gap}
                  id="dDay"
                  name="gap"
                  onChange={handleChangeSize}
                  onMouseDown={() => setAreavisible(true)}
                  onMouseUp={() => setAreavisible(false)}
                />
              </AreaContent>
            </AreaContainer>
          </LeftBox>
          <RightBox>
            <AreaContainer className="outline">
              <FlexWrapper>
                <AreaTitle>시간표 설정</AreaTitle>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>야간</span>
                  <Toggle state={timeZone} setState={setTimeZone} />
                  <span>주간</span>
                </label>
              </FlexWrapper>
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
  height: 100dvh;
  /* background-color: red; */

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

const DisplaySection = styled.section<{
  width: number;
  primarycolor: string;
  mobilePreviewBtnVisible: boolean;
}>`
  background-color: ${(props) => props.primarycolor};
  width: ${(props) => props.width}px;
  /* height: calc(100% - 20px); */
  height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5rem; // 추후 동적으로 설정
  margin: 10px 0;
  z-index: 1;

  p {
    margin: 0;
  }

  border-radius: 30px;
  box-shadow: 0 6px 20px -15px #000;
  border-width: 1px 1px 0 0;
  border-color: #fff;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.7);

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

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
    /* display: none; */
    position: fixed;
    background-color: rgba(255, 255, 255, 0.8); /* 밝게 보이도록 배경색 추가 */
    top: 0;
    left: ${(props) => `calc(-${props.width}px)`};
    -webkit-box-shadow: 0px 10px 13px -7px #000000,
      10px 3px 15px 0px rgba(0, 0, 0, 0.21);
    box-shadow: 0px 10px 13px -7px #000000,
      10px 3px 15px 0px rgba(0, 0, 0, 0.21);
    ${(props) =>
      props.mobilePreviewBtnVisible &&
      css`
        transform: ${`translate(${props.width + 10}px, 0)`};
        transition: all 0.2s ease-in-out;
      `}
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
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

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
    display: flex;
    flex-direction: column-reverse;
    padding: 0;
    gap: 0;
    width: 100vw;
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
  }
`;

const LeftBox = styled.div`
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
  }
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
  margin: 0.5rem 0;
  /* background-color: red; */
  font-size: 1rem;
  font-weight: 600;
`;

const AreaSubTitle = styled.p`
  margin-bottom: 0.5rem;
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
  /* padding: 0.5rem; */
  gap: 1rem;

  &.row {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  > label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  span {
    white-space: nowrap;
  }
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
  padding-top: 1rem;
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
  padding-bottom: 1rem;
`;

const StyledDatePicker = styled(DatePicker)`
  text-align: center;
  width: 100%;

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
  width: 100%;
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
  font-size: 1rem;
  font-weight: 700;
`;

const StatusText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 900;
  color: #ee4f36;
`;

const TimeText = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MobilePreviewBtn = styled.div`
  cursor: pointer;
  display: none;
  background-color: #fff;
  position: fixed;
  right: 10px;
  bottom: 10px;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  -webkit-box-shadow: 0px 10px 13px -7px #000000,
    5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
    display: flex;
  }

  @media screen and (max-width: 480px) {
    /** 모바일 세로 */
  }
`;
