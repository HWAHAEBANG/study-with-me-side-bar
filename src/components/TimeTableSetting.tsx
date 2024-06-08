import { useEffect, useState } from "react";
import {
  AreaContainer,
  AreaContent,
  AreaTitle,
  StyledDatePicker,
} from "../styles/common";
import Table from "./Table";
import { Button, DropDown } from "./atom";
import { zeroPad } from "react-countdown";
import { saveFirebaseTimeTableDataList } from "../api/firebase";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

const TimeTableSetting = ({
  timeZone,
  getReadOnlyTimeTableDataList,
  readOnlyTimeTable,
}: {
  timeZone: string;
  getReadOnlyTimeTableDataList: () => void;
  readOnlyTimeTable: any;
}) => {
  const sessionOptionList = [
    "선택",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ];

  const TIME_TABLE_COLUMN_LIST = [
    { accessor: "session", text: "교시", width: "5rem" },
    { accessor: "startTime", text: "시작 시간", width: "4rem" },
    { accessor: "endTime", text: "종료 시간", width: "4rem" },
    { accessor: "color", text: "강조", width: "3rem" },
    { accessor: "deleteBtn", text: "", width: "3rem" },
  ];

  const [timetableList, setTimetableList] = useState<any>([]);

  useEffect(() => {
    setTimetableList(readOnlyTimeTable);
  }, [readOnlyTimeTable]);

  const handleChangeTimePicker = (date: any, index: number, name: string) => {
    // console.log("날짜 찍어보기", date, index, name);
    const newDate = timetableList.map((item: any, idx: number) => {
      if (index === idx) {
        return {
          ...item,
          [name]: `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`,
        };
      } else {
        return item;
      }
    });
    setTimetableList(newDate);
  };

  const timeTableTableDataList = timetableList.map(
    (data: any, index: number) => ({
      ...data,
      session: (
        <DropDown
          // disabled={disabled}
          style={{ margin: 0, width: 60, height: 30, padding: "0" }}
          // width="70px"
          value={timetableList[index].session}
          onChange={(e) =>
            setTimetableList((prev: any) =>
              prev.map((item: any, idx: number) =>
                idx === index ? { ...item, session: e.target.value } : item
              )
            )
          }
        >
          {sessionOptionList.map((item, idx) => (
            <option key={idx} value={item} style={{ textAlign: "center" }}>
              {item}
            </option>
          ))}
        </DropDown>
      ),
      startTime: (
        <StyledDatePicker
          selected={new Date()}
          onChange={(date) => handleChangeTimePicker(date, index, "startTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          placeholderText="HH:mm"
          value={timetableList[index].startTime}
        />
      ),
      endTime: (
        <StyledDatePicker
          selected={new Date()}
          onChange={(date) => handleChangeTimePicker(date, index, "endTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          placeholderText="HH:mm"
          value={timetableList[index].endTime}
        />
      ),
      color: (
        <input
          type="checkBox"
          checked={timetableList[index].color}
          onChange={(e) =>
            setTimetableList((prev: any) =>
              prev.map((item: any, idx: number) =>
                idx === index ? { ...item, color: e.target.checked } : item
              )
            )
          }
        />
      ),
      deleteBtn: (
        <Button onClick={() => handleDeleteTimeTableRow(index)}>삭제</Button>
      ),
    })
  );

  const handleAddNewTimeTableRow = () => {
    setTimetableList((prev: any) => [
      ...prev,
      { session: "", startTime: "", endTime: "", color: false },
    ]);
  };

  const handleResetTimeTable = () => {
    return setTimetableList([]);
  };

  const handleInitTimeTable = () => {
    return setTimetableList(readOnlyTimeTable);
  };

  const handleSaveTimeTable = () => {
    if (emptyValueChecker(timetableList) && validTimeChecker(timetableList)) {
      saveFirebaseTimeTableDataList(timeZone, timetableList);
      getReadOnlyTimeTableDataList();
      Swal.fire({
        text: "저장을 완료했어요.",
        icon: "success",
        timer: 2000,
      });
    }
  };

  const handleDeleteTimeTableRow = (index: number) => {
    setTimetableList(
      timetableList.filter((item: any, idx: number) => index !== idx)
    );
  };

  const validTimeChecker = (timetableList: any) => {
    let lateThanPrevEndTime = true;
    timetableList.forEach((item: any, index: number) => {
      if (index === 0) return;
      if (
        Number(item.startTime.replace(":", "")) >
          Number(timetableList[index - 1].endTime.replace(":", "")) ||
        (timetableList[index - 1].endTime.slice(0, 2) === "23" &&
          item.startTime.slice(0, 2) === "00")
      ) {
        return;
      } else {
        return (lateThanPrevEndTime = false);
      }
    });

    if (!lateThanPrevEndTime) {
      Swal.fire({
        text: "시작 시간은 이전 교시의 종료 시간보다 늦거나 같을 수 없어요.",
        icon: "warning",
        timer: 3000,
      });
      return lateThanPrevEndTime;
    }

    let lateThanStartTime = true;
    timetableList.forEach((item: any, index: number) => {
      if (
        Number(item.startTime.replace(":", "")) <
          Number(item.endTime.replace(":", "")) ||
        (item.endTime.slice(0, 2) === "00" &&
          item.startTime.slice(0, 2) === "23")
      ) {
        return;
      } else {
        return (lateThanStartTime = false);
      }
    });

    if (!lateThanStartTime) {
      Swal.fire({
        text: "종료 시간은 해당 교시의 시작 시간보다 빠를 수 없어요.",
        icon: "warning",
        timer: 3000,
      });
      return lateThanStartTime;
    }

    return lateThanPrevEndTime && lateThanStartTime;
  };

  const emptyValueChecker = (timetableList: any) => {
    let result = true;
    timetableList.forEach((item: any, index: number) => {
      // console.log(Object.values(item));

      Object.values(item).forEach((value) => {
        if (typeof value !== "boolean" && (!value || value === "선택")) {
          return (result = false);
        } else {
          return;
        }
      });
    });

    if (!result) {
      Swal.fire({
        text: "모든 값을 입력해주세요.",
        icon: "warning",
        timer: 2000,
      });
      return result;
    }

    return result;
  };

  return (
    <AreaContainer className="outline">
      <AreaTitle>시간표 설정</AreaTitle>
      <AreaContent>
        <Table
          columnList={TIME_TABLE_COLUMN_LIST}
          dataList={timeTableTableDataList}
          onAddRow={handleAddNewTimeTableRow}
          onReset={handleResetTimeTable}
          onInit={handleInitTimeTable}
          onSave={handleSaveTimeTable}
        />
      </AreaContent>
    </AreaContainer>
  );
};

export default TimeTableSetting;
