import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { AreaContainer, AreaContent, AreaTitle } from "../styles/common";
import { RadioBox, RadioLabel } from "./atom";
import { saveFirebaseStatusData } from "../api/firebase";

const CurrentStatusSetting = ({
  timeZone,
  setStatusData,
  statusData,
}: {
  timeZone: string;
  statusData: string;
  setStatusData: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <AreaContainer className="outline">
      <AreaTitle>현재 상태 설정</AreaTitle>
      <AreaContent className="row">
        <div>
          <RadioLabel htmlFor="live">
            <RadioBox
              type="radio"
              name="statusData"
              id="live"
              checked={statusData === "LIVE"}
              onChange={(e) => {
                setStatusData("LIVE");
                saveFirebaseStatusData(timeZone, "LIVE");
              }}
            />
            <CardFromText>LIVE</CardFromText>
          </RadioLabel>
          <RadioLabel htmlFor="meal">
            <RadioBox
              type="radio"
              name="statusData"
              id="meal"
              checked={statusData === "Meal Time"}
              onChange={(e) => {
                setStatusData("Meal Time");
                saveFirebaseStatusData(timeZone, "Meal Time");
              }}
            />
            <CardFromText>Meal Time</CardFromText>
          </RadioLabel>
        </div>
        <div>
          <RadioLabel htmlFor="recorded">
            <RadioBox
              type="radio"
              name="statusData"
              id="recorded"
              checked={statusData === "24/7"}
              onChange={(e) => {
                setStatusData("24/7");
                saveFirebaseStatusData(timeZone, "24/7");
              }}
            />
            <CardFromText>24/7</CardFromText>
          </RadioLabel>
          <RadioLabel htmlFor="shower">
            <RadioBox
              type="radio"
              name="statusData"
              id="shower"
              checked={statusData === "Shower Room"}
              onChange={(e) => {
                setStatusData("Shower Room");
                saveFirebaseStatusData(timeZone, "Shower Room");
              }}
            />
            <CardFromText>Shower Room</CardFromText>
          </RadioLabel>
        </div>
      </AreaContent>
    </AreaContainer>
  );
};

export default CurrentStatusSetting;

const CardFromText = styled.span`
  padding: 1rem;
  white-space: nowrap;
`;
