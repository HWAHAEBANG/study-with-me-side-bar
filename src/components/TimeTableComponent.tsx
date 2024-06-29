import React, { useEffect, useState } from "react";
import { calculateTimeDifferenceInMinutes, isNow } from "../util/calcTimeDiff";
import styled, { css } from "styled-components";
import Clock from "react-live-clock";

const TimeTableComponent = ({
  displaySetting,
  areavisible,
  readOnlyTimeTable,
}: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeTableWrapper
      width={displaySetting?.timeTable?.width}
      height={displaySetting?.timeTable?.height}
      gap={displaySetting?.timeTable?.gap}
      areavisible={areavisible}
    >
      {readOnlyTimeTable.map((item: any, idx: number) => (
        <TimeTableRow
          now={isNow(
            item.startTime,
            item.endTime,
            currentTime.toLocaleTimeString("en-GB", { hour12: false })
          )}
          meal={item.color}
          key={idx}
        >
          {item.session}. {item.startTime} ~ {item.endTime} (
          {calculateTimeDifferenceInMinutes(item.startTime, item.endTime)}
          ')
        </TimeTableRow>
      ))}
    </TimeTableWrapper>
  );
};

export default React.memo(TimeTableComponent);

const TimeTableWrapper = styled.div<{
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
`;

const TimeTableRow = styled.p<{ now: boolean; meal: boolean }>`
  font-family: "TheJamsil5Bold";
  font-weight: 800;
  font-size: 1.5rem;
  padding: 0.3rem 0.4rem 0.3rem 0.5rem;
  border-radius: 1rem;
  line-height: 25px;
  ${(props) =>
    props.now &&
    css`
      background-color: #ff9b9b;
    `}
  ${(props) =>
    props.meal &&
    css`
      color: #ee4f36;
    `}
    ${(props) =>
    props.meal &&
    props.now &&
    css`
      color: #ffffff;
      background-color: #ff9b9b;
    `}
`;

// import React, { useEffect, useRef, useState } from "react";
// import { calculateTimeDifferenceInMinutes, isNow } from "../util/calcTimeDiff";
// import styled, { css } from "styled-components";
// import Clock from "react-live-clock";

// const TimeTableComponent = ({
//   displaySetting,
//   areavisible,
//   readOnlyTimeTable,
// }: any) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const requestRef = useRef<number>();

//   const updateTime = () => {
//     setCurrentTime(new Date());
//     requestRef.current = requestAnimationFrame(updateTime);
//   };

//   useEffect(() => {
//     requestRef.current = requestAnimationFrame(updateTime);
//     return () => cancelAnimationFrame(requestRef.current!);
//   }, []);

//   //   console.log("리렌더");

//   return (
//     <TimeTableWrapper
//       width={displaySetting?.timeTable?.width}
//       height={displaySetting?.timeTable?.height}
//       gap={displaySetting?.timeTable?.gap}
//       areavisible={areavisible}
//     >
//       <p>{currentTime.toLocaleTimeString("en-GB", { hour12: false })}</p>

//       {readOnlyTimeTable.map((item: any, idx: number) => (
//         <TimeTableRow
//           now={isNow(
//             item.startTime,
//             item.endTime,
//             currentTime.toLocaleTimeString("en-GB", { hour12: false })
//           )}
//           meal={item.color}
//           key={idx}
//         >
//           {item.session}. {item.startTime} ~ {item.endTime} (
//           {calculateTimeDifferenceInMinutes(item.startTime, item.endTime)}
//           ')
//         </TimeTableRow>
//       ))}
//     </TimeTableWrapper>
//   );
// };

// export default TimeTableComponent;

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
//   ${(props) =>
//     props.meal &&
//     css`
//       color: #ee4f36;
//     `}
// `;
