import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from "styled-components";
const UnityGame = styled(Unity)`
  border-radius: 12px;
  width: 1000px;
  height: 500px;
`;

const CreateForm = () => {
  const { unityProvider, loadingProgression, isLoaded, sendMessage } =
    useUnityContext({
      loaderUrl: "build/Build/Build.loader.js",
      dataUrl: "build/Build/Build.data",
      frameworkUrl: "build/Build/Build.framework.js",
      codeUrl: "build/Build/Build.wasm",
    });
  const testUnityMessage1 = async () => {
    const obj = {
      roomId: "123",
      roomName: "RoomSSS",
      userId: "456E",
      userName: "LocLoc",
    };
    sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));
  };
  const testUnityMessage2 = async () => {
    const obj = {
      roomId: "123",
      roomName: "RoomSSS",
      userId: "4562",
      userName: "LocLocE",
    };
    sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));
  };
  return (
    <>
      <button onClick={testUnityMessage1}>Test1</button>
      <button onClick={testUnityMessage2}>Test2</button>
      <UnityGame
        unityProvider={unityProvider}
        className="unity-game"
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </>
  );
};

export default CreateForm;
