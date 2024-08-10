import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUnityContext, Unity, ReactUnityEventParameter } from "react-unity-webgl";

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

    const handleUnload = async () => {
        await unload();
    };

    // Handle Unity Application Quit event
    const handleUnityApplicationQuit = useCallback((jsonData: any) => {
        console.log(typeof jsonData)
        // const data = JSON.parse(jsonData);
        console.log("Data received from Unity on quit:", jsonData);
        setShow(false);


        // if (typeof jsonData === "string") {
        //     try {
        //         const data = JSON.parse(jsonData);
        //         console.log("Data received from Unity on quit:", data);
        //     } catch (error) {
        //         console.error("Failed to parse JSON data from Unity:", error);
        //     }
        // }
    }, []);

    useEffect(() => {
        // Add the event listener
        addEventListener("FinishGame", handleUnityApplicationQuit);

        // Clean up the event listener on unmount
        return () => {
            removeEventListener("FinishGame", handleUnityApplicationQuit);
        };
    }, [addEventListener, removeEventListener, handleUnityApplicationQuit]);

    const setQuitCallback = (callback: () => void) => {
        setOnQuitCallback(() => callback);
    };

    return (
        <UnityGameContext.Provider value={{ sendMessage, isLoaded, unityProvider, show, setShow, setQuitCallback, handleUnload }}>
            {children}
        </UnityGameContext.Provider>
    );
};

export default UnityGameContext;
