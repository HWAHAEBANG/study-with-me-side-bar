export function calcSecondsDiff(startTime: string, endTime: string): number {
  // 시간 문자열을 분리하여 배열로 만듭니다.
  const [startHours, startMinutes, startSeconds] = startTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);

  // Date 객체를 생성합니다.
  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, startSeconds, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, endSeconds, 0);

  // 두 시간의 차이를 밀리초 단위로 계산합니다.
  const diffMilliseconds = startDate.getTime() - endDate.getTime();

  // 차이를 초 단위로 변환합니다.
  const diffSeconds = diffMilliseconds / 1000;

  return Math.abs(diffSeconds); // 절대값을 반환합니다.
}
