import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import DDday from "./DDday";
import TimeTableComponent from "./TimeTableComponent";
import moment from "moment";
import {
  getFirebaseDDayDataList,
  getFirebaseSettingData,
  getFirebaseStatusData,
  getFirebaseTimeTableDataList,
} from "../api/firebase";

const Display = ({
  timeZone,
  displaySetting,
  statusData,
  areavisible,
  getReadOnlyTimeTableDataList,
  getReadOnlyDDayDataList,
  readOnlyTimeTable,
  readOnlyDDay,
}: {
  timeZone: string;
  displaySetting: any;
  statusData: string;
  areavisible: boolean;
  getReadOnlyTimeTableDataList: () => void;
  getReadOnlyDDayDataList: () => void;
  readOnlyTimeTable: any;
  readOnlyDDay: any;
}) => {
  const todayDate = moment().format("MMM D ddd");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobilePreviewBtnVisible, setMobilePreviewBtnVisible] = useState(false);

  useEffect(() => {
    getReadOnlyTimeTableDataList();
    getReadOnlyDDayDataList();
  }, []);

  // 현재 시간 =================================================
  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <DisplaySection
      width={displaySetting?.sideBar?.width}
      mobilePreviewBtnVisible={mobilePreviewBtnVisible}
      id="target3"
    >
      <DateAndStatusWrapper
        width={displaySetting?.dateAndStatus?.width}
        height={displaySetting?.dateAndStatus?.height}
        gap={displaySetting?.dateAndStatus?.gap}
        areavisible={areavisible}
      >
        <DisplayTitle>[Current status]</DisplayTitle>
        {/* <DateText>{todayDate}</DateText>
        <StatusText>{statusData}</StatusText> */}
      </DateAndStatusWrapper>
      <TimeTableComponent
        displaySetting={displaySetting}
        areavisible={areavisible}
        readOnlyTimeTable={readOnlyTimeTable}
      />
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
      ></VideoWrapper>
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
  );
};

export default Display;

const DisplaySection = styled.section<{
  width: number;
  mobilePreviewBtnVisible: boolean;
}>`
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

  border-radius: 20px;
  /*border-width: 1px 1px 0 0;
    border-color: #fff;
    border-style: solid;*/
  /* background-color: #fff; */

  /* &::before {
      width: 560px;
      height: 300px;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.25); 
      border-radius: 20px; 
      box-shadow: 0 6px 20px -15px #000;
      border-width: 1px 1px 0 0;
      border-color: #fff;
      border-style: solid;
    } */

  @media screen and (max-width: 768px) {
    /** 모바일 가로, 타블렛 세로 */
    /* display: none; */
    position: fixed;
    background-color: rgba(255, 255, 255, 0.8); // 밝게 보이도록 배경색 추가
    top: 0;
    box-shadow: 0 6px 20px -15px #000;
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
  justify-content: start;
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

const DisplayTitle = styled.p`
  margin: 0;
  font-weight: 900;
  font-size: 0.8rem;
  font-family: "TheJamsil5Bold";
`;

const DateText = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
  font-family: "TheJamsil5Bold";
`;

const StatusText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 900;
  color: #ee4f36;
  font-family: "TheJamsil5Bold";
`;

const TimeText = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-family: "TheJamsil5Bold";
  font-weight: 800;
`;
