import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  AreaContainer,
  AreaContent,
  AreaSubTitle,
  AreaTitle,
} from "../styles/common";
import { saveFirebaseSettingData } from "../api/firebase";

const DisplaySetting = ({
  timeZone,
  setDisplaySetting,
  displaySetting,
  setAreavisible,
}: {
  timeZone: string;
  setDisplaySetting: Dispatch<SetStateAction<any>>;
  displaySetting: any;
  setAreavisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleChangeSize = (e: any) => {
    const { id, name, valueAsNumber } = e?.target;
    setDisplaySetting((prev: any) => ({
      ...prev,
      // @ts-ignore
      [id]: { ...prev[id], [name]: valueAsNumber },
    }));
  };

  useEffect(() => {
    if (displaySetting.length === 0) return;
    // debounce(() => saveFirebaseSettingData(displaySetting));
    saveFirebaseSettingData(timeZone, displaySetting);
  }, [displaySetting]);

  return (
    <AreaContainer className="outline">
      <AreaTitle>전체 너비 조절 (Only PC)</AreaTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.sideBar?.tempWidth} //보류
          id="sideBar"
          name="tempWidth"
          onChange={handleChangeSize}
          onMouseUp={() =>
            setDisplaySetting((prev: any) => ({
              ...prev,
              sideBar: {
                ...prev.sideBar,
                width: prev?.sideBar?.tempWidth,
              },
            }))
          }
        />
      </AreaContent>
      <AreaTitle>영역별 사이즈 조절</AreaTitle>
      <AreaSubTitle>날짜 영역</AreaSubTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.dateAndStatus?.width}
          id="dateAndStatus"
          name="width"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.dateAndStatus?.height}
          id="dateAndStatus"
          name="height"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={15}
          value={displaySetting?.dateAndStatus?.gap}
          id="dateAndStatus"
          name="gap"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
      </AreaContent>
      <AreaSubTitle>시간표 영역</AreaSubTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.timeTable?.width}
          id="timeTable"
          name="width"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.timeTable?.height}
          id="timeTable"
          name="height"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={15}
          value={displaySetting?.timeTable?.gap}
          id="timeTable"
          name="gap"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
      </AreaContent>
      <AreaSubTitle>현재 시간 영역</AreaSubTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.currentTime?.width}
          id="currentTime"
          name="width"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.currentTime?.height}
          id="currentTime"
          name="height"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={15}
          value={displaySetting?.currentTime?.gap}
          id="currentTime"
          name="gap"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
      </AreaContent>
      <AreaSubTitle>비디오 영역</AreaSubTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.video?.width}
          id="video"
          name="width"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.video?.height}
          id="video"
          name="height"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
      </AreaContent>
      <AreaSubTitle>디데이 영역</AreaSubTitle>
      <AreaContent className="row">
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.dDay?.width}
          id="dDay"
          name="width"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={500}
          value={displaySetting?.dDay?.height}
          id="dDay"
          name="height"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
        <input
          type="range"
          min={0}
          max={15}
          value={displaySetting?.dDay?.gap}
          id="dDay"
          name="gap"
          onChange={handleChangeSize}
          onMouseDown={() => setAreavisible(true)}
          onMouseUp={() => setAreavisible(false)}
        />
      </AreaContent>
    </AreaContainer>
  );
};

export default DisplaySetting;
