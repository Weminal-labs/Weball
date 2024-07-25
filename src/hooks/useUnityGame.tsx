import { useContext } from "react";
import { Unity } from "react-unity-webgl";
import styled from "styled-components";
import UnityGameContext from "../contexts/UnityGameProvider";
import { Box } from "@mui/material";

export const useUnityGame = () => useContext(UnityGameContext);

const UnityGame = styled(Unity)`
  border-radius: 12px;
  width: 1000px;
  height: 500px;
`;

export const UnityGameComponent: React.FC = () => {
  const { unityProvider } = useUnityGame();

  return (
    <Box sx={style}>
      <UnityGame unityProvider={unityProvider} />
    </Box>
  );
};
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "75%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};
