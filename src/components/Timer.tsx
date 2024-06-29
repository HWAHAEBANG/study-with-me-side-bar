import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { calcSecondsDiff } from "../util/calcSecondsDiff";
import { timeToSeconds } from "../util/timeToSecons";
import useSound from "use-sound";

ChartJS.register(ArcElement, Tooltip, Legend);

function Timer({
  timeZone,
  readOnlyTimeTable,
  timerVisible,
  activeBell,
  // bellVolume,
  // textSize,
  // gaugeColor,
  // gaugeWidth,
  breackText,
  sessionText,
}: any) {
  const [remainingTime, setRemainingTime] = useState(" ");
  const [text, setText] = useState(" ");
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [percent, setPercent] = useState(100);
  const [presentSession, setPresentSession] = useState(readOnlyTimeTable[0]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [timeArr2, setTimeArr2] = useState([]);
  const [schoolbell] = useSound("/sound/schoolbell.mp3", {
    volume: 1,
  });

  useEffect(() => {
    timerStart();
  }, [readOnlyTimeTable]);

  // console.log("리드온리", readOnlyTimeTable);

  useEffect(() => {
    updateChartPercent();
    if (remainingTime === "00:00:00") {
      if (activeBell) schoolbell();
      timerStart();
    }
  }, [remainingTime, currentIndex]);

  const updateChartPercent = () => {
    // console.log("커런", currentIndex);
    if (timeArr2.length === 0 || currentIndex === timeArr2.length) return;

    if (currentIndex % 2 === 0) {
      setText(breackText);
    }
    if (currentIndex % 2 === 1) {
      setText(
        sessionText
          ?.split("{number}")
          .join(Number(readOnlyTimeTable[Math.floor(currentIndex / 2)].session))

        // Number(readOnlyTimeTable[Math.floor(currentIndex / 2)].session) +
        //   " 교시"
      );
    }

    // console.log("sessionText", sessionText?.spilt("{number}"));

    //=========================

    setPresentSession(readOnlyTimeTable[Math.floor(currentIndex / 2)]);

    setPercent(
      (timeToSeconds(remainingTime) /
        calcSecondsDiff(
          presentSession?.startTime + ":00",
          presentSession?.endTime + ":00"
        )) *
        100
    );
    //==========================
    // console.log("커런인덱스", currentIndex);

    const nextTarget = timeArr2[currentIndex];
    // console.log("넥스트 타겟", nextTarget);

    //@ts-ignore
    const targetHour = nextTarget.split(":")[0];
    //@ts-ignore
    const targetMinutes = nextTarget.split(":")[1];

    const now = new Date();
    const target = new Date(now.getTime());
    target.setHours(Number(targetHour), Number(targetMinutes), 0, 0);
    setTargetTime(target);
  };

  const timerStart = (type?: string) => {
    if (readOnlyTimeTable.length === 0) return;

    let flag = true;

    const timeArr = readOnlyTimeTable
      .map((item: any) => [item.startTime, item.endTime])
      .flat();

    setTimeArr2(timeArr);

    const currentTime = new Date();

    timeArr.forEach((item: string, index: number) => {
      const currentTimeNum = Number(
        currentTime
          .toLocaleTimeString("en-GB", { hour12: false })
          .replaceAll(":", "")
      );

      const tableTimeNum = Number(item.replace(":", "") + "00");

      // console.log(
      //   "예스",
      //   flag,
      //   Math.floor(currentTimeNum / 10000),
      //   Math.floor(tableTimeNum / 10000)
      // );
      if (
        index !== 0 &&
        index !== 1 &&
        flag &&
        Math.floor(currentTimeNum / 10000) === 23 &&
        Math.floor(tableTimeNum / 10000) === 0
      ) {
        // console.log("들어왔어");

        flag = false;
        // console.log("인덱스는", index);

        return setCurrentIndex(index);
      }

      if (flag && currentTimeNum < tableTimeNum) {
        flag = false;
        return setCurrentIndex(index);
      } else {
        return;
      }
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("타겟이 문제인가", targetTime);

      const now = new Date();
      if (targetTime) {
        setRemainingTime(getRemainingTime(now, targetTime));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  //=====================================

  function isMidnight(targetTimeStamp: number, currentTimeStamp: number) {
    // console.log("함수 진입", targetTimeStamp, currentTimeStamp);
    const target = new Date(targetTimeStamp);
    const current = new Date(currentTimeStamp);
    // console.log("흠", current.getHours(), target.getHours());

    // console.log("흐미", current.getHours() === 23 && target.getHours() === 0);

    return current.getHours() === 23 && target.getHours() === 0;
  }

  //====================================

  function getRemainingTime(current: Date, target: Date) {
    let targetTimeStemp = target.getTime();
    let currentTimeStemp = current.getTime();

    // console.log(
    //   targetTimeStemp > currentTimeStemp,
    //   targetTimeStemp,
    //   currentTimeStemp,
    //   targetTimeStemp - currentTimeStemp
    // );

    if (targetTimeStemp < currentTimeStemp) {
      // 자정이 지나서 00으로 바뀌는 경우 24시간을 더해줌.
      if (isMidnight(targetTimeStemp, currentTimeStemp)) {
        targetTimeStemp += 86400000;
        // console.log("타겟타임 보상");
      }
    }
    const difference = targetTimeStemp - currentTimeStemp + 1000; // 1000은 1초 차이나는 거에 대한 보상.
    const totalSeconds = Math.max(Math.floor(difference / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  //=====================================
  const options = {
    cutoutPercentage: 10, // 도넛 굵기 값이 클수록 얇아짐. Chart.js 3+에서는 'cutout'을 사용.
    maintainAspectRatio: false, // false : 상위 div에 구속
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: false, // 툴팁 비활성화
      },
      title: {
        display: false,
      },
      doughnutlabel: {
        labels: [
          {
            text: "0",
            font: {
              size: 20,
              weight: "bold",
            },
          },
          {
            text: "total",
          },
        ],
      },
    },
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: "My First Dataset",
        data: [percent, 100 - percent],
        // backgroundColor: [
        //   /*           currentIndex % 2 === 0 ? "#5a3f1c" : gaugeColor,
        //   // "#ffffff", */
        // ],
        backgroundColor: [
          currentIndex % 2 !== 0 ? " #610B0B" : "rgb(255, 255, 255, 0.3)",
          "rgb(255, 255, 255, 0.3)",
        ],
        hoverOffset: 4,
        // cutout: `${100 - gaugeWidth}%`, // 도넛 안쪽 원의 크기 설정
        cutout: `90%`, // 도넛 안쪽 원의 크기 설정
        borderRadius: [20, 0],
        borderWidth: [0],
        spacing: 0,
      },
    ],
  };

  return (
    <Container>
      {timerVisible && (
        <>
          <Doughnut
            data={data}
            // @ts-ignore
            options={options}
            // @ts-ignore
            plugins={data.plugins}
          ></Doughnut>
          <Wrapper>
            <Text>{text}</Text>
            <Count>{remainingTime}</Count>
            {/* <Count>
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </Count> */}
          </Wrapper>
        </>
      )}
    </Container>
  );
}
export default Timer;

const Container = styled.div`
  width: 30rem;
  height: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 5rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
`;

const Text = styled.span`
  font-size: 3rem;
  font-family: "TheJamsil5Bold";
  font-weight: 800;
  color: #111111;
`;

const Count = styled.span`
  font-size: 4.5rem;
  font-weight: 900;
  color: #111111;
`;
