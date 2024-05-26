import React, { useEffect, useState } from "react";
import CurrentStatusSetting from "../components/CurrentStatusSetting";
import DisplaySetting from "../components/DisplaySetting";
import Display from "../components/Display";
import TimeTableSetting from "../components/TimeTableSetting";
import styled from "styled-components";
import {
  getFirebaseDDayDataList,
  getFirebaseSettingData,
  getFirebaseStatusData,
  getFirebaseTimeTableDataList,
} from "../api/firebase";

const DayTime = () => {
  const TIME_ZONE = "dayTime";

  const initialSizeState = {
    // 추후 로컬 스토리지데이터로 교체
    sideBar: { width: 200, tempWidth: 200 },
    dateAndStatus: { width: 180, height: 110, gap: 1 },
    timeTable: { width: 180, height: 300, gap: 1 },
    currentTime: { width: 180, height: 70, gap: 1 },
    video: { width: 180, height: 80, gap: 1 },
    dDay: { width: 180, height: 140, gap: 3 },
  };

  const [displaySetting, setDisplaySetting] = useState<any>([]);
  const [statusData, setStatusData] = useState("");
  const [areavisible, setAreavisible] = useState<boolean>(false);
  const [readOnlyTimeTable, setReadOnlyTimeTable] = useState([]);
  const [readOnlyDDay, setReadOnlyDDay] = useState([]);

  const getReadOnlyTimeTableDataList = async () => {
    try {
      const timeTableRes = await getFirebaseTimeTableDataList(TIME_ZONE);
      setReadOnlyTimeTable(timeTableRes);
    } catch (error) {
      console.log(error);
    }
  };

  const getReadOnlyDDayDataList = async () => {
    try {
      const dDayRes = await getFirebaseDDayDataList();
      setReadOnlyDDay(dDayRes);
    } catch (error) {
      console.log(error);
    }
  };

  const getSettingData = async () => {
    try {
      const getSettingRes = await getFirebaseSettingData(TIME_ZONE);
      setDisplaySetting(getSettingRes);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusData = async () => {
    try {
      const getStatusRes = await getFirebaseStatusData(TIME_ZONE);
      setStatusData(getStatusRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSettingData();
    getStatusData();
  }, []);

  return (
    <Main>
      <Display
        timeZone={TIME_ZONE}
        displaySetting={displaySetting}
        statusData={statusData}
        areavisible={areavisible}
        getReadOnlyDDayDataList={getReadOnlyDDayDataList}
        getReadOnlyTimeTableDataList={getReadOnlyTimeTableDataList}
        readOnlyDDay={readOnlyDDay}
        readOnlyTimeTable={readOnlyTimeTable}
      />
      <ControllSection>
        <LeftBox>
          <CurrentStatusSetting
            timeZone={TIME_ZONE}
            statusData={statusData}
            setStatusData={setStatusData}
          />
          <DisplaySetting
            timeZone={TIME_ZONE}
            displaySetting={displaySetting}
            setDisplaySetting={setDisplaySetting}
            setAreavisible={setAreavisible}
          />
        </LeftBox>
        <RightBox>
          <TimeTableSetting
            timeZone={TIME_ZONE}
            readOnlyTimeTable={readOnlyTimeTable}
            getReadOnlyTimeTableDataList={getReadOnlyTimeTableDataList}
          />
        </RightBox>
      </ControllSection>
    </Main>
  );
};

export default DayTime;

const Main = styled.main`
  display: flex;
`;

const ControllSection = styled.div`
  background-color: #fff;
  height: calc(100% - 20px);
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* margin: 10px 0; */
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
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 30px;
    box-shadow: 0 6px 20px -15px #000;
    border-width: 1px 1px 0 0;
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
