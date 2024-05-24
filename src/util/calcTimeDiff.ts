function parseTimeToMinutes(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function calculateTimeDifferenceInMinutes(
  startTimeStr: string,
  endTimeStr: string
) {
  const startTimeInMinutes = parseTimeToMinutes(startTimeStr);
  const endTimeInMinutes = parseTimeToMinutes(endTimeStr);

  return endTimeInMinutes - startTimeInMinutes;
}

export function isNow(startTime: string, endTime: string, currnetTime: string) {
  const current = Number(currnetTime.slice(0, 5).replace(":", ""));
  const end = Number(endTime.replace(":", "")); // 땡 하면 바로 쉬니까 1분 뺴야함.
  const start = Number(startTime.replace(":", ""));

  //   console.log(start, current, end);

  if (current >= start && current < end) {
    return true;
  } else {
    return false;
  }
}
