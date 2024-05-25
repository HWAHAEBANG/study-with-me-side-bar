import React from "react";
//@ts-ignore
import Slider from "react-slick";
import styled from "styled-components";

const DDday = ({ readOnlyDDay }: any) => {
  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
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

    // 목표 날짜와 현재 날짜 사이의 일수 차이 계산
    const differenceInTime = targetDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

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
  height: 4rem;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    overflow: visible;
  }
`;

const Container = styled.div`
  /* background-color: yellow; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  margin: 0;
  text-align: center;

  &.name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  &.dDay {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ee4f36;
  }

  &.date {
    font-size: 0.7rem;
    font-weight: 700;
  }
`;
