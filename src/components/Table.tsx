import React from "react";
import styled from "styled-components";

const Table = ({ columnList, dataList }: any) => {
  /* 컬럼별 너비만 배열로 만들기 */
  const cellWidthArr = columnList.map((item: any) => item.width);

  /* 로우별 값만 배열로 만들기(이중 배열 구조)*/
  const doubleArrOfValue = dataList.map((item: any) => Object.values(item));

  console.log("testtest", doubleArrOfValue);

  return (
    <TableContainer>
      <TableHeader>
        {columnList.map((data: any, index: number) => (
          <Cell key={index} width={cellWidthArr[index]}>
            {data.text}
          </Cell>
        ))}
      </TableHeader>
      {doubleArrOfValue.map((data: any, index: number) => (
        <TableRow key={index}>
          {data.map((item: any, index: number) => (
            <Cell key={index} width={cellWidthArr[index]}>
              {item}
            </Cell>
          ))}
        </TableRow>
      ))}
      <AddDataBtn>+</AddDataBtn>
      <ButtonContainer>
        <button>모두 지우기</button>
        <button>초기화</button>
        <button>저장</button>
      </ButtonContainer>
    </TableContainer>
  );
};

export default Table;

const TableContainer = styled.div`
  /* background-color: pink; */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-top: 1px solid aliceblue;
  border-bottom: 1px solid aliceblue;
`;

const TableHeader = styled.div`
  height: 2rem;
  background-color: aliceblue;
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

const AddDataBtn = styled.button`
  width: 100%;
`;
