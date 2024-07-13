import React, { useEffect, useState } from "react";
import "../App.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import LoadingGame from "../components/LoadingGame";

const Home = () => {
  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "build/Build/Build.loader.js",
    dataUrl: "build/Build/Build.data",
    frameworkUrl: "build/Build/Build.framework.js",
    codeUrl: "build/Build/Build.wasm",
  });

  return (
    <div className="unity-container">
      {!isLoaded ? <LoadingGame progress={loadingProgression} /> : null}
      <Unity
        unityProvider={unityProvider}
        className="unity-game"
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </div>
  );
};

export default Home;
