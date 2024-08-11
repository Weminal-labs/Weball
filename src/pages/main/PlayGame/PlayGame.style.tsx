import styled from "styled-components";
import { Box, Grid } from "@mui/material";

export const ContainerBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const FlexBox = styled.div`
  width: 100%;
  display: flex;
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
  padding: 50px;
  background: linear-gradient(45deg, #219ce2 30%, #0cbd16 90%);
`;