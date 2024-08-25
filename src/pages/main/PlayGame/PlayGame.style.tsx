import styled from "styled-components";
import { Box, Grid } from "@mui/material";

export const ContainerBox = styled.div`
  width: 100%;
  display: flex;
    flex-direction:column;
    gap:8px;
    margin-top:10px

`;

export const FlexBox = styled.div`
  width: 100%;
  display: flex;
    justify-content: space-between;

  gap: 12px;
`;

export const GridContainer = styled(Grid)`
  width: 100%;
  display: flex;
  justify-content: left;
`;

export const JoinRoomContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  flex-wrap: wrap;
  gap: 25px;
`;