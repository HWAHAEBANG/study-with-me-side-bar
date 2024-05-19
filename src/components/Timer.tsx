import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import styled from "styled-components";

const Timer = ({
  readOnlyTimeTable,
  currentTime,
}: {
  readOnlyTimeTable: any;
  currentTime: string;
}) => {
  // 카운트 다운 ===================================================================

  //   interface TimerState {
  //     type: "session" | "break";
  //   }

  //   const [timerState, setState] = useState({type: "session", time:})

  const [test, setTest] = useState("");

  const zeroPad = (number: number) => {
    return number.toString().padStart(2, "0");
  };

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return;
    } else {
      return (
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

  // console.log("타임", timetableList);
  useEffect(() => {
    const timeArr = readOnlyTimeTable
      .map((item: any) => [item.startTime, item.endTime])
      .flat();

    let currentIdx;
    let flag = true;

    timeArr.forEach((item: string, index: number) => {
      const currentTimeNum = Number(currentTime.replaceAll(":", ""));
      const tableTimeNum = Number(item.replace(":", "") + "00");

      if (!flag || currentTimeNum >= tableTimeNum) {
        return;
      } else {
        flag = false;
        return (currentIdx = index);
      }
    });

    if (!currentIdx) return console.log("현재위치 못찾음");
    if (currentIdx % 2 === 0) {
      setTest("쉬는 시간");
      return;
    }
    if (currentIdx % 2 === 1) {
      setTest(readOnlyTimeTable[Math.floor(currentIdx / 2)].session);
    }
  }, [currentTime]);

  const getTimerTime = useCallback(() => {
    return Date.now() + 5000;
  }, []);

  return (
    <TempTimerArea>
      <p>{test} 교시</p>
      <Countdown date={getTimerTime()} renderer={renderer} />
    </TempTimerArea>
  );
};

export default Timer;

const TempTimerArea = styled.div`
  width: 10rem;
  height: 10rem;
  background-color: orange;
`;

//================================================================================
