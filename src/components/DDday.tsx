import React from "react";
//@ts-ignore
import Slider from "react-slick";
import styled from "styled-components";

const DDday = ({ readOnlyDDay }: any) => {
  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  function convertToDday(targetDateStr: string) {
    // 한국 시간대로 날짜를 변환하는 함수
    function toKST(date: Date) {
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      const kstOffset = 9 * 60 * 60000; // 한국 시간대는 UTC+9
      return new Date(utc + kstOffset);
    }

    const targetDate = toKST(new Date(targetDateStr));
    const today = toKST(new Date());

    // console.log("타겟데이트", targetDate);
    // console.log("투데이", today);

    // 목표 날짜와 현재 날짜 사이의 일수 차이 계산
    // const differenceInTime = targetDate.getTime() - today.getTime();
    const differenceInTime =
      targetDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // console.log("디타", differenceInTime);
    // console.log("디데", differenceInDays);

    // D-day 포맷으로 변환
    const ddayFormat =
      differenceInDays === 0
        ? "D-day"
        : differenceInDays > 0
        ? `D-${differenceInDays}`
        : `D+${Math.abs(differenceInDays)}`;

    return ddayFormat;
  }

  return (
    <StyledWrapper>
      <StyledSlider {...settings}>
        {readOnlyDDay.map((item: any, index: number) => (
          <Container key={index}>
            <Text className="name">{item.testName}</Text>
            <Text className="dDay">{convertToDday(item.testDate)}</Text>
            <Text className="date">{item.testDate}</Text>
          </Container>
        ))}
      </StyledSlider>
    </StyledWrapper>
  );
};

export default DDday;

const StyledWrapper = styled.section`
  overflow: hidden;
  width: 100%;
  height: 10rem;
`;

const StyledSlider = styled(Slider)`
  .slick-slide {
    height: 500px;
  }
  .slick-list {
    overflow: visible;
  }
`;

const Container = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 600px;
`;

const Text = styled.div`
  margin: 0.5rem;
  text-align: center;
  font-family: "TheJamsil5Bold";
  font-weight: 800;

  &.name {
    font-size: 3rem;
    /* font-weight: 700; */
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  &.dDay {
    font-size: 2rem;
    /* font-weight: 700; */
    color: #ee4f36;
  }

  &.date {
    font-size: 1.2rem;
    /* font-weight: 700; */
    color: #ffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;
