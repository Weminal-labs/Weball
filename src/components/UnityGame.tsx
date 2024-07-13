import React from "react";
import { Unity } from "react-unity-webgl";
import LoadingGame from "../components/LoadingGame";

interface UnityGameProps {
    unityProvider: any;
    isLoaded: boolean;
    loadingProgression: number;
}

const UnityGame: React.FC<UnityGameProps> = ({ unityProvider, isLoaded, loadingProgression }) => {
    return (
        <>
            {!isLoaded ? <LoadingGame progress={loadingProgression} /> : null}
            <Unity
                unityProvider={unityProvider}
                className="unity-game"
                style={{ display: isLoaded ? "block" : "none" }}
            />
        </>
    );
}

export default UnityGame;
