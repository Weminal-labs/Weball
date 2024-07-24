import { useContext } from "react";
import { Unity } from "react-unity-webgl";
import styled from "styled-components";
import UnityGameContext from "../contexts/UnityGameProvider";

export const useUnityGame = () => useContext(UnityGameContext);

const UnityGame = styled(Unity)`
  border-radius: 12px;
  width: 1000px;
  height: 500px;
`;

export const UnityGameComponent: React.FC = () => {
  const { unityProvider, show } = useUnityGame();

  return (
    <UnityGame unityProvider={unityProvider} />
  );
};