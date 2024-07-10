import React from "react";
import "../App.css";
import { Unity, useUnityContext } from "react-unity-webgl";

const Home=()=> {
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
      <Unity unityProvider={unityProvider} className="unity-game" />
    </div>
  );
}

export default Home;
