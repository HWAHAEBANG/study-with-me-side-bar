import React, { useEffect, useState } from "react";
import Timer from "../components/Timer";
import {
  getFirebaseTimeTableDataList,
  getFirebaseTimerSettingData,
  saveFirebaseTimerSettingData,
} from "../api/firebase";
import styled from "styled-components";
import Toggle from "../components/common/Toggle";
import { StyledInput } from "../styles/common";

const AllDayTimer = () => {
  const TIME_ZONE = "allDayTime";
  const [readOnlyTimeTable, setReadOnlyTimeTable] = useState([]);

  const getReadOnlyTimeTableDataList = async () => {
    try {
      const timeTableRes = await getFirebaseTimeTableDataList(TIME_ZONE);
      setReadOnlyTimeTable(timeTableRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReadOnlyTimeTableDataList();
  }, []);

  const initval = {
    timerVisible: true,
    bellActive: false,
    breakText: "Braek Time",
  };

  const [timerSettingData, setTimerSettingData] = useState<any>([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    //@ts-ignore
    setTimerSettingData((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettingData = async () => {
    const timerSettingRes = await getFirebaseTimerSettingData(TIME_ZONE);
    setTimerSettingData(timerSettingRes);
  };

  useEffect(() => {
    if (timerSettingData.length === 0) return;
    saveFirebaseTimerSettingData(TIME_ZONE, timerSettingData);
  }, [timerSettingData]);

  useEffect(() => {
    saveSettingData();
  }, []);

  return (
    <TimerContainer>
      <Timer
        readOnlyTimeTable={readOnlyTimeTable}
        timerVisible={timerSettingData.timerVisible}
        activeBell={timerSettingData.bellActive}
        sessionText={timerSettingData.sessionText}
        breackText={timerSettingData.breakText}
      />
      <ToggleList>
        <label>
          <span>보이기/숨기기</span>
          <Toggle
            accessor="timerVisible"
            state={timerSettingData.timerVisible}
            setState={setTimerSettingData}
          />
        </label>
        <label>
          <span>종소리 ON/OFF</span>
          <Toggle
            accessor="bellActive"
            state={timerSettingData.bellActive}
            setState={setTimerSettingData}
          />
        </label>
        <label>
          <span> 공부 시간 문구 : </span>
          <StyledInput
            value={timerSettingData.sessionText}
            name="sessionText"
            onChange={handleChange}
          />
        </label>
        <label>
          <span> 쉬는 시간 문구 : </span>
          <StyledInput
            value={timerSettingData.breakText}
            name="breakText"
            onChange={handleChange}
          />
        </label>
      </ToggleList>
    </TimerContainer>
  );
};

export default AllDayTimer;

const TimerContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
