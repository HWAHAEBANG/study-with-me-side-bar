import { Dispatch, SetStateAction, useState } from "react";
import styled, { css } from "styled-components";
import theme from "../theme";

const ToggleContainer = styled.div<{ state: boolean }>`
  cursor: pointer;
  position: relative;
  display: flex;
  min-width: 3.25rem;
  width: 3.25rem;
  height: 2rem;
  padding: 0.5rem 0.25rem;
  align-items: center;
  gap: 0.625rem;
  border-radius: 3.125rem;
  border: 2px solid #ccc;
  background: #f5f5f5;
  ${({ state }) =>
    state &&
    css`
      border: 2px solid ${theme.color.main};
      background: ${theme.color.main};
    `}
`;

const Desc = styled.div<{ state: boolean }>`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 3.125rem;
  background: #ccc;
  animation: toggleOff 0.3s ease-in-out;
  top: 2px;
  left: 3px;
  ${({ state }) =>
    state &&
    css`
      top: 2px;
      left: 22px;
      background: #fff;
      animation: toggleOn 0.3s ease-in-out;
    `}

  @keyframes toggleOn {
    from {
      top: 2px;
      left: 3px;
    }
    to {
      top: 2px;
      left: 22px;
    }
  }
  @keyframes toggleOff {
    from {
      top: 2px;
      left: 22px;
    }
    to {
      top: 2px;
      left: 3px;
    }
  }
`;

interface ToggleProps {
  state: boolean;
  setState: Dispatch<SetStateAction<any>>;
  accessor: string;
}

const Toggle = ({ state, setState, accessor }: ToggleProps) => {
  const toggleHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setState((prev: any) => ({ ...prev, [accessor]: !state }));
    // isOn의 상태를 변경하는 메소드를 구현
  };

  return (
    <ToggleContainer
      // 클릭하면 토글이 켜진 상태(isOn)를 boolean 타입으로 변경하는 메소드가 실행
      state={state}
      onClick={toggleHandler}
    >
      <Desc state={state} />
      {/* 아래에 div 엘리먼트 2개가 있다. 각각의 클래스를 'toggle-container', 'toggle-circle' 로 지정 */}
      {/* Toggle Switch가 ON인 상태일 경우에만 toggle--checked 클래스를 div 엘리먼트 2개에 모두 추가. 조건부 스타일링을 활용*/}
    </ToggleContainer>
  );
};

export default Toggle;
