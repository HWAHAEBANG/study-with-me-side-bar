import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

function Timer({ readOnlyTimeTable, timerVisible }: any) {
  const [remainingTime, setRemainingTime] = useState("00:00:00");
  const [text, setText] = useState("");
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    let currentIdx;
    let flag = true;

    const timeArr = readOnlyTimeTable
      .map((item: any) => [item.startTime, item.endTime])
      .flat();

    const currentTime = new Date();

    timeArr.forEach((item: string, index: number) => {
      const currentTimeNum = Number(
        currentTime
          .toLocaleTimeString("en-GB", { hour12: false })
          .replaceAll(":", "")
      );
      const tableTimeNum = Number(item.replace(":", "") + "00");

      if (!flag || currentTimeNum >= tableTimeNum) {
        return;
      } else {
        flag = false;
        return (currentIdx = index);
      }
    });

    if (!currentIdx) return;
    if (currentIdx % 2 === 0) {
      setText("쉬는 시간");
    }
    if (currentIdx % 2 === 1) {
      setText(readOnlyTimeTable[Math.floor(currentIdx / 2)].session + " 교시");
    }

    const nextTarget = timeArr[currentIdx];
    const targetHour = nextTarget.split(":")[0];
    const targetMinutes = nextTarget.split(":")[1];

    const now = new Date();
    const target = new Date(now.getTime());
    target.setHours(Number(targetHour), Number(targetMinutes), 0, 0);
    setTargetTime(target);
  }, [readOnlyTimeTable]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (targetTime) {
        setRemainingTime(getRemainingTime(now, targetTime));
      }
      requestRef.current = requestAnimationFrame(updateTime);
    };

    requestRef.current = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [targetTime]);

  function getRemainingTime(current: Date, target: Date) {
    const difference = target.getTime() - current.getTime();
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

  return (
    <Container>
      {timerVisible && (
        <Wrapper>
          <Text>{text}</Text>
          <Count>{remainingTime}</Count>
        </Wrapper>
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
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span`
  font-size: 1rem;
  font-weight: 700;
`;

const Count = styled.span`
  font-size: 2rem;
  font-weight: 700;
`;

// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";

// function Timer({ readOnlyTimeTable, timerVisible }: any) {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [targetTime, setTargetTime] = useState<Date | null>(null);
//   const [remainingTime, setRemainingTime] = useState("00:00:00");
//   const requestRef = useRef<number>();
//   const [text, setText] = useState("");
//   const [timeIndex, setTimeIndex] = useState(-1);

//   useEffect(() => {
//     let currentIdx;
//     let flag = true;

//     const timeArr = readOnlyTimeTable
//       .map((item: any) => [item.startTime, item.endTime])
//       .flat();

//     // console.log(timeArr);

//     timeArr.forEach((item: string, index: number) => {
//       const currentTimeNum = Number(
//         currentTime
//           .toLocaleTimeString("en-GB", { hour12: false })
//           .replaceAll(":", "")
//       );
//       const tableTimeNum = Number(item.replace(":", "") + "00");

//       //   console.log("커런", currentTimeNum, "테이", tableTimeNum);

//       if (!flag || currentTimeNum >= tableTimeNum) {
//         return;
//       } else {
//         flag = false;
//         return (currentIdx = index);
//       }
//     });

//     // console.log("커튼트 인덱스다", currentIdx);

//     if (!currentIdx) return console.log("현재위치 못찾음");
//     if (currentIdx % 2 === 0) {
//       //   setTimeIndex(currentIdx);
//       setText("쉬는 시간");
//       //   return;
//     }
//     if (currentIdx % 2 === 1) {
//       //   setTimeIndex(currentIdx);
//       setText(readOnlyTimeTable[Math.floor(currentIdx / 2)].session + " 교시");
//     }

//     // console.log("제발", timeArr[currentIdx]);
//     const nextTarget = timeArr[currentIdx];
//     const targetHour = nextTarget.split(":")[0];
//     const targetMinutes = nextTarget.split(":")[1];

//     const now = new Date();
//     const target = new Date(now.getTime());
//     // target.setHours(19, 30, 0, 0); // 목표 시간을 06:10:00으로 설정
//     target.setHours(Number(targetHour), Number(targetMinutes), 0, 0);
//     setTargetTime(target);
//   }, [
//     currentTime,
//     readOnlyTimeTable,
//     timeIndex,
//     setTimeIndex,
//     setText,
//     setTargetTime,
//   ]);

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       setCurrentTime(now);
//       if (targetTime) {
//         setRemainingTime(getRemainingTime(now, targetTime));
//       }
//       requestRef.current = requestAnimationFrame(updateTime);
//     };

//     requestRef.current = requestAnimationFrame(updateTime);
//     return () => cancelAnimationFrame(requestRef.current!);
//   }, [timeIndex, targetTime]);

//   function getRemainingTime(current: Date, target: Date) {
//     const difference = target.getTime() - current.getTime();
//     const totalSeconds = Math.max(Math.floor(difference / 1000), 0);
//     const hours = Math.floor(totalSeconds / 3600)
//       .toString()
//       .padStart(2, "0");
//     const minutes = Math.floor((totalSeconds % 3600) / 60)
//       .toString()
//       .padStart(2, "0");
//     const seconds = (totalSeconds % 60).toString().padStart(2, "0");
//     return `${hours}:${minutes}:${seconds}`;
//   }

//   return (
//     <Container>
//       {timerVisible && (
//         <Wrapper>
//           <Text>{text}</Text>
//           <Count>{remainingTime}</Count>
//         </Wrapper>
//       )}
//     </Container>
//   );
// }
// export default Timer;

// const Container = styled.div`
//   width: 15rem;
//   height: 15rem;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// const Text = styled.span`
//   font-size: 1rem;
//   font-weight: 700;
// `;

// const Count = styled.span`
//   font-size: 2rem;
//   font-weight: 700;
// `;
