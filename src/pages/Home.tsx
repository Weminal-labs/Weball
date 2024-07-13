import "../App.css";
import { useUnityContext } from "react-unity-webgl";
import Header from "../components/Header";
import UnityGame from "../components/UnityGame";

const Home = () => {
  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    // sendMessage,
    // addEventListener,
    // removeEventListener,
  } = useUnityContext({
    loaderUrl: "build/Build/Build.loader.js",
    dataUrl: "build/Build/Build.data",
    frameworkUrl: "build/Build/Build.framework.js",
    codeUrl: "build/Build/Build.wasm",
  });

  return (
    <>
      <div style={{
        backgroundImage: "url('../public/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        
      }}>
        <Header />
        <div className="unity-container">
          <UnityGame unityProvider={unityProvider} isLoaded={isLoaded} loadingProgression={loadingProgression} />
        </div>
      </div>
    </>

  );
};

export default Home;