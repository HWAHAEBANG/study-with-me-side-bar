import styled, { css } from "styled-components";
import dropIcon from "../lib/img/dropIcon.svg";

export const Input = styled.input`
  padding: 6px 8px;
  background: #f8fcff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  white-space: nowrap;
  /* margin: 8px 7px 8px 15px; */
  :disabled {
    color: #cfcfcf;
  }

  &:hover {
    filter: brightness(0.98);
  }
`;

export const RadioLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.2rem 1rem 0.2rem 0;

  span {
    padding-left: 0.5rem;
  }
  ${(props) =>
    props.disabled &&
    css`
      color: #cccccc;
    `}
  @media screen and (max-width: 1200px) {
    font-size: 11px;
    white-space: nowrap;
  }
`;

export const CardFromText = styled.span`
  padding: 1rem;
  white-space: nowrap;
`;

export const RadioBox = styled.input.attrs({ type: "radio" })`
  cursor: pointer;
  appearance: none;
  border: max(1px, 0.1em) solid lightgray;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  transition: border 0.3s ease-in-out;
  margin-right: 0.5rem;
  &:disabled {
    background-color: #fff;
  }
  &:checked {
    border: 0.5em solid #507788;
  }
`;

export const Button = styled.button`
  display: flex;
  height: 2rem;
  padding: 0.4375rem 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  flex: 1 0 0;
  border-radius: 0.25rem;
  /* border: 1px solid #eaeaea; */
  color: #dae9f4;
  white-space: nowrap;
  background-color: #598497;
  border: none;

  /* Button/M */
  font-size: 0.875rem;
  font-weight: 500;

  :disabled {
    background-color: #eaeaea;
    color: #ccc;
  }

  &:hover {
    filter: brightness(0.9);
  }
`;

type DropDownType = {
  isTime?: boolean;
  marginLeft?: string;
  width?: string;
};

export const DropDown = styled.select<DropDownType>`
  padding: 8px;
  padding-right: 15px;
  /* background: #f8fcff; */
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : `15px`)};
  width: ${(props) => props.width};
  background: url(${dropIcon}) #f8fcff no-repeat;
  background-position: right 10px bottom 50%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  option {
    :disabled {
      color: #e1e1e1;
    }
  }

  &:hover {
    filter: brightness(0.98);
  }

  @media screen and (max-width: 1200px) {
    font-size: 11px;
  }
`;
