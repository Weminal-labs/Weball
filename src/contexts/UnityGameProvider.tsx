import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUnityContext, Unity } from "react-unity-webgl";
import styled from "styled-components";

// Tạo UnityGame context
const UnityGameContext = createContext<any>(null);
interface GameProviderProps {
    children: ReactNode;
  }
export const UnityGameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { sendMessage, isLoaded, unityProvider } = useUnityContext({
    loaderUrl: "build/Build/Build.loader.js",
    dataUrl: "build/Build/Build.data",
    frameworkUrl: "build/Build/Build.framework.js",
    codeUrl: "build/Build/Build.wasm",
  });

  const [show, setShow] = useState(false);

  return (
    <UnityGameContext.Provider
      value={{ sendMessage, isLoaded, unityProvider, show, setShow }}
    >
      {children}
    </UnityGameContext.Provider>
  );
};
export default UnityGameContext;

