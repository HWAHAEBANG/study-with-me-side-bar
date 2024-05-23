export function timeToSeconds(time: string): number {
  // 시간 문자열을 분리하여 배열로 만듭니다.
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // 시간을 초 단위로 변환합니다.
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds;
}
