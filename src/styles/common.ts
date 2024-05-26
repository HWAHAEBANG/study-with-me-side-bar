import ReactDatePicker from "react-datepicker";
import styled from "styled-components";
import { Input } from "../components/atom";

export const AreaContainer = styled.div<{ primarycolor?: string }>`
  /* background-color: aliceblue; */
  display: flex;
  flex-direction: column;
  padding: 1rem;

  &.outline {
    /* border: 0.5px solid ${(props) => props.primarycolor}; */
    border-radius: 1rem;
    background-color: #f5f5f5;
  }
`;

export const AreaTitle = styled.p`
  margin: 0;
  margin: 0.5rem 0;
  /* background-color: red; */
  font-size: 1rem;
  font-weight: 600;
`;

export const AreaContent = styled.div`
  /* background-color: blue; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding: 0.5rem; */
  gap: 1rem;

  &.row {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

export const AreaSubTitle = styled.p`
  margin-bottom: 0.5rem;
  /* background-color: red; */
  font-size: 0.8rem;
  font-weight: 400;
`;

export const StyledDatePicker = styled(ReactDatePicker)`
  text-align: center;
  width: 100%;

  padding: 6px 8px;
  background: #f8fcff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  /* margin: 8px 7px 8px 15px; */
  :disabled {
    color: #cfcfcf;
  }

  &:hover {
    filter: brightness(0.98);
  }
`;

export const StyledInput = styled(Input)`
  width: 100%;
`;
