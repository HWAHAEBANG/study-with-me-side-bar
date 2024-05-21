// import { v4 as uuid } from "uuid";
import { initializeApp } from "firebase/app"; // firebase앱을 가지고 와서

import { getDatabase, ref, set, get, remove } from "firebase/database";

const firebaseConfig = {
  //config object를 설정한 다음에
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 시간표 데이터 조회
export const getFirebaseTimeTableDataList = (timeZone: boolean) => {
  return get(ref(database, `timeTable/${timeZone ? "dayTime" : "nightTime"}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// 시간표 데이터 저장
export const saveFirebaseTimeTableDataList = (
  timeZone: boolean,
  array: any
) => {
  set(ref(database, `timeTable/${timeZone ? "dayTime" : "nightTime"}`), array);
};

// 디데이 데이터 조회
export const getFirebaseDDayDataList = () => {
  return get(ref(database, "dDay"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// 디데이 데이터 저장
export const saveFirebaseDDayDataList = (array: any) => {
  set(ref(database, `dDay`), array);
};

// 세팅 데이터 조회
export const getFirebaseSettingData = () => {
  return get(ref(database, "setting"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// 세팅 데이터 저장
export const saveFirebaseSettingData = (array: any) => {
  set(ref(database, `setting`), array);
};

// 상태 데이터 조회
export const getFirebaseStatusData = () => {
  return get(ref(database, "status"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return "";
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// 상태 데이터 저장
export const saveFirebaseStatusData = (data: string) => {
  set(ref(database, `status`), data);
};
