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
}: any) {
  const [remainingTime, setRemainingTime] = useState(" ");
  const [text, setText] = useState(" ");
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [percent, setPercent] = useState(100);
  const [presentSession, setPresentSession] = useState(readOnlyTimeTable[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeArr2, setTimeArr2] = useState([]);
  const [schoolbell] = useSound("/sound/schoolbell.mp3", {
    volume: 1,
  });

  console.log("테스트테스트", readOnlyTimeTable);

  useEffect(() => {
    // console.log("처음만");
    setCurrentIndex(0);
    setPercent(100);
    setText(" ");
    setTargetTime(null);
    setRemainingTime(" ");
    setTimeArr2([]);
    timerStart("start");
  }, [readOnlyTimeTable]);

  useEffect(() => {
    updateChartPercent();
    // console.log("타임", remainingTime);
    if (remainingTime === "00:00:00") {
      // console.log("타임아웃");
      if (activeBell) schoolbell();
      timerStart("restart");
    }
  }, [remainingTime, currentIndex]);

  const updateChartPercent = () => {
    //  타임 테이블 다 끝났을 때, 없는 인덱스 참조해서 튕김현상 방지
    // if (!currentIndex || !timeArr2 || !timeArr2[currentIndex]) return;
    // console.log("음", currentIndex, timeArr2.length);

    if (
      // currentIndex === 0 ||
      !currentIndex ||
      timeArr2.length === 0 ||
      currentIndex === timeArr2.length
    )
      return;
    // console.log("어케통과하");
    // console.log("currentIndex", currentIndex);

    if (!currentIndex) return;
    if (currentIndex % 2 === 0) {
      setText(breackText);
    }
    if (currentIndex % 2 === 1) {
      setText(
        Number(readOnlyTimeTable[Math.floor(currentIndex / 2)].session) +
          " 교시"
      );
    }

    //=========================

    setPresentSession(readOnlyTimeTable[Math.floor(currentIndex / 2)]);

    // const nowSession =

    // console.log("디버그", presentSession?.startTime, presentSession?.endTime);
    // console.log(
    //   "디버그2",
    //   timeToSeconds(remainingTime),
    //   calcSecondsDiff(
    //     presentSession?.startTime + ":00",
    //     presentSession?.endTime + ":00"
    //   )
    // );

    // console.log(
    //   "오잉",
    //   (timeToSeconds(remainingTime) /
    //     calcSecondsDiff(
    //       presentSession?.startTime + ":00",
    //       presentSession?.endTime + ":00"
    //     )) *
    //     100
    // );

    setPercent(
      (timeToSeconds(remainingTime) /
        calcSecondsDiff(
          presentSession?.startTime + ":00",
          presentSession?.endTime + ":00"
        )) *
        100
    );
    //==========================

    const nextTarget = timeArr2[currentIndex];
    // console.log("넥스트타겟", timeArr2);

    //@ts-ignore
    const targetHour = nextTarget.split(":")[0];
    //@ts-ignore
    const targetMinutes = nextTarget.split(":")[1]; // 여기까지함

    const now = new Date();
    const target = new Date(now.getTime());
    target.setHours(Number(targetHour), Number(targetMinutes), 0, 0);
    setTargetTime(target);
  };

  const timerStart = (type?: string) => {
    // console.log("타이머 시작");
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

      if (!flag || currentTimeNum >= tableTimeNum) {
        // if (type === "start") return setCurrentIndex(index - 1);
        return;
      } else {
        flag = false;
        // if (type === "restart") return (currentIdx = index + 1);
        // if (type === "start") return (currentIdx = index);
        if (type === "restart") return setCurrentIndex(index);
        if (type === "start") return setCurrentIndex(index);
      }
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      // setCurrentTime(now);
      if (targetTime) {
        setRemainingTime(getRemainingTime(now, targetTime));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  //=====================================

  function getRemainingTime(current: Date, target: Date) {
    const difference = target.getTime() - current.getTime() + 1000; // 1000은 1초 차이나는 거에 대한 보상.
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
  // test
  // const [currentTime, setCurrentTime] = useState(new Date());

  // const updateTime = () => {
  //   setCurrentTime(new Date());
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     updateTime();
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  //================
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
  width: 15rem;
  height: 15rem;
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
  font-size: 1.4rem;
  font-family: "TheJamsil5Bold";
  font-weight: 800;
  color: #111111;
`;

const Count = styled.span`
  font-size: 2rem;
  font-weight: 900;
  color: #111111;
`;
