import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useUnityContext, Unity } from "react-unity-webgl";

// Create UnityGame context
const UnityGameContext = createContext<any>(null);

interface GameProviderProps {
    children: ReactNode;
}

export const UnityGameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const { sendMessage, isLoaded, unityProvider, addEventListener, removeEventListener, unload } = useUnityContext({
        loaderUrl: "build/Build/Build.loader.js",
        dataUrl: "build/Build/Build.data",
        frameworkUrl: "build/Build/Build.framework.js",
        codeUrl: "build/Build/Build.wasm",
    });

    const [show, setShow] = useState(false);
    const [onQuitCallback, setOnQuitCallback] = useState<() => void>(() => () => {});
    const handleUnload =async ()=>{
        await unload();

    }
    useEffect(() => {
        const handleUnityApplicationQuit = () => {
            setShow(false);
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            if (onQuitCallback) {
                onQuitCallback();
            }
        };

        addEventListener("FinishGame", handleUnityApplicationQuit);

        return () => {
            removeEventListener("FinishGame", handleUnityApplicationQuit);
        };
    }, []);

    const setQuitCallback = (callback: () => void) => {

    };

    return (
        <UnityGameContext.Provider value={{ sendMessage, isLoaded, unityProvider, show, setShow, setQuitCallback,handleUnload }}>
            {children}
        </UnityGameContext.Provider>
    );
};

export default UnityGameContext;
