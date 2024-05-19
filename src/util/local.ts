// 시간표 데이터 조회
export const getLocalTimeTableDataList = () => {
  const respone = localStorage.getItem("timeTable");
  if (respone === null) return respone;
  return JSON.parse(respone);
};

// 시간표 데이터 저장
export const saveLocalTimeTableDataList = (array: any) => {
  console.log("실행됨");

  localStorage.setItem("timeTable", JSON.stringify(array));
};

// 디데이 데이터 조회
export const getLocalDDayDataList = () => {
  const respone = localStorage.getItem("dDay");
  if (respone === null) return respone;
  return JSON.parse(respone ?? "");
};

// 디데이 데이터 저장
export const saveLocalDDayDataList = (array: any) => {
  localStorage.setItem("dDay", JSON.stringify(array));
};

// 세팅 데이터 조회
export const getLocalSettingData = () => {
  const respone = localStorage.getItem("setting");
  if (respone === null) return respone;
  return JSON.parse(respone ?? "");
};

// 세팅 데이터 일부 수정
export const updateLocalSettingData = (array: any) => {
  localStorage.setItem("setting", JSON.stringify(array));
};

// 디데이 데이터 조회
export const getLocalStatus = () => {
  const respone = localStorage.getItem("status");
  if (respone === null) return respone;
  return JSON.parse(respone ?? "");
};

// 디데이 데이터 저장
export const saveLocalStatus = (data: string) => {
  localStorage.setItem("status", JSON.stringify(data));
};
