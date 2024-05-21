import React from "react";
import styled from "styled-components";
import { Button } from "./atom";

const Table = ({
  columnList,
  dataList,
  onAddRow,
  onReset,
  onInit,
  onSave,
}: any) => {
  /* 컬럼별 너비만 배열로 만들기 */
  const cellWidthArr = columnList.map((item: any) => item.width);
  const accessorArr = columnList.map((item: any) => item.accessor);

  /* 로우별 값만 배열로 만들기(이중 배열 구조)*/
  const doubleArrOfValue = dataList.map(
    (item: any) => accessorArr.map((accesor: any) => item[accesor]) // 중요!! 신박한 접근법
  );

  return (
    <TableContainer>
      <TableHeader>
        {columnList.map((data: any, index: number) => (
          <Cell key={index} width={cellWidthArr[index]}>
            {data.text}
          </Cell>
        ))}
      </TableHeader>
      {doubleArrOfValue.length === 0 && (
        <TableRow style={{ margin: "0 auto" }}>데이터가 없습니다.</TableRow>
      )}
      {doubleArrOfValue.map((data: any, index: number) => (
        <TableRow key={index}>
          {data.map((item: any, index: number) => (
            <Cell key={index} width={cellWidthArr[index]}>
              {item}
            </Cell>
          ))}
        </TableRow>
      ))}
      <AddDataBtn onClick={onAddRow}>+</AddDataBtn>
      <ButtonContainer>
        <Button onClick={onReset}>모두 지우기</Button>
        <Button onClick={onInit}>초기화</Button>
        <Button onClick={onSave}>저장</Button>
      </ButtonContainer>
    </TableContainer>
  );
};

export default Table;

const TableContainer = styled.div`
  /* background-color: #598497; */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-top: 1px solid aliceblue;
  border-bottom: 1px solid aliceblue;
`;

const TableHeader = styled.div`
  height: 2rem;
  background-color: #d5e2e8;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableRow = styled.div`
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding: 0.2rem;
  /* background-color: yellow; */
`;

const Cell = styled.span<{ width: string }>`
  width: ${(props) => props.width};
  text-align: center;
  /* background-color: green; */
`;

const ButtonContainer = styled.div`
  margin: 0.5rem;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
`;

const AddDataBtn = styled(Button)`
  width: 100%;
`;
