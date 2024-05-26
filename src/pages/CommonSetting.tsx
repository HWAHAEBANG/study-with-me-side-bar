import React, { useEffect, useState } from "react";
import {
  AreaContainer,
  AreaContent,
  AreaTitle,
  StyledDatePicker,
  StyledInput,
} from "../styles/common";
import Table from "../components/Table";
import {
  getFirebaseDDayDataList,
  saveFirebaseDDayDataList,
} from "../api/firebase";
import Swal from "sweetalert2";
import { Button } from "../components/atom";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const CommonSetting = () => {
  const DDay_COLUMN_LIST = [
    { accessor: "id", text: "순번", width: "3rem" },
    { accessor: "testName", text: "시험명", width: "8rem" },
    { accessor: "testDate", text: "시험날짜", width: "6rem" },
    { accessor: "deleteBtn", text: "", width: "3rem" },
  ];

  const getReadOnlyDDayDataList = async () => {
    try {
      const dDayRes = await getFirebaseDDayDataList();
      setReadOnlyDDay(dDayRes); // 초기화용
      setDDayList(dDayRes);
    } catch (error) {
      console.log(error);
    }
  };

  const [dDayList, setDDayList] = useState<any>([]);
  const [readOnlyDDay, setReadOnlyDDay] = useState<any>([]);

  useEffect(() => {
    getReadOnlyDDayDataList();
  }, []);

  const handleAddNewDDayRow = () => {
    setDDayList((prev: any) => [
      ...prev,
      { id: prev.length + 1, testName: "", testDate: "" },
    ]);
  };

  const handleResetDDay = () => {
    return setDDayList([]);
  };

  const handleInitDDay = () => {
    return setDDayList(readOnlyDDay);
  };

  const handleSaveDDay = () => {
    if (emptyValueChecker(dDayList)) {
      saveFirebaseDDayDataList(dDayList);
      getReadOnlyDDayDataList();
      Swal.fire({
        text: "저장을 완료했어요.",
        icon: "success",
        timer: 2000,
      });
    }
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

  const dDayTableDataList = dDayList
    .sort((a: any, b: any) => {
      if (a.testDate === "") return 1;
      return a.testDate.replaceAll("-", "") - b.testDate.replaceAll("-", "");
    })
    .map((data: any, index: number) => ({
      ...data,
      id: index + 1,
      testName: (
        <StyledInput
          type="string"
          value={dDayList[index].testName}
          onChange={(e: any) =>
            setDDayList((prev: any) =>
              prev.map((item: any, idx: number) =>
                idx === index ? { ...item, testName: e.target.value } : item
              )
            )
          }
        />
      ),
      testDate: (
        <StyledDatePicker
          selected={new Date()}
          value={dDayList[index].testDate}
          onChange={(date) => handleChangeDatePicker(date, index, "testDate")}
          locale="ko-KR"
          dateFormat="yyyy/MM/dd"
          placeholderText="yyyy/MM/dd"
        />
      ),

      deleteBtn: (
        <Button onClick={() => handleDeleteDDayRow(index)}>삭제</Button>
      ),
    }));

  const handleChangeDatePicker = (date: any, index: number, name: string) => {
    // console.log("날짜 찍어보기", date, index, name);
    const newDate = dDayList.map((item: any, idx: number) => {
      if (index === idx) {
        return {
          ...item,
          [name]: date.toISOString().slice(0, 10),
        };
      } else {
        return item;
      }
    });
    setDDayList(newDate);
  };

  const handleDeleteDDayRow = (index: number) => {
    setDDayList(dDayList.filter((item: any, idx: number) => index !== idx));
  };

  return (
    <StyledAreaContainer className="outline">
      <AreaTitle>디데이 설정</AreaTitle>
      <AreaContent>
        <Table
          columnList={DDay_COLUMN_LIST}
          dataList={dDayTableDataList}
          onAddRow={handleAddNewDDayRow}
          onReset={handleResetDDay}
          onInit={handleInitDDay}
          onSave={handleSaveDDay}
        />
      </AreaContent>
    </StyledAreaContainer>
  );
};

export default CommonSetting;

const StyledAreaContainer = styled(AreaContainer)`
  margin: 0 auto;
  overflow-y: auto;
  width: 100%;
  max-width: 30rem;
  height: 95%;
`;
