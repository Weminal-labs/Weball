import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useUnityContext, Unity } from "react-unity-webgl";

// Create UnityGame context
const UnityGameContext = createContext<any>(null);

interface GameProviderProps {
    children: ReactNode;
}

export const UnityGameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const { sendMessage, isLoaded, unityProvider, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl: "build/Build/Build.loader.js",
        dataUrl: "build/Build/Build.data",
        frameworkUrl: "build/Build/Build.framework.js",
        codeUrl: "build/Build/Build.wasm",
    });

    const [show, setShow] = useState(false);
    const [onQuitCallback, setOnQuitCallback] = useState<() => void>(() => () => {});

    useEffect(() => {
        const handleUnityApplicationQuit = () => {
            setShow(false);
            if (onQuitCallback) {
                onQuitCallback();
            }
        };

        addEventListener("onUnityApplicationQuit", handleUnityApplicationQuit);

        return () => {
            removeEventListener("onUnityApplicationQuit", handleUnityApplicationQuit);
        };
    }, []);

    const setQuitCallback = (callback: () => void) => {

    };

    return (
        <UnityGameContext.Provider value={{ sendMessage, isLoaded, unityProvider, show, setShow, setQuitCallback }}>
            {children}
        </UnityGameContext.Provider>
    );
};

export default UnityGameContext;
