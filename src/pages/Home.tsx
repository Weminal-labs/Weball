import "../App.css";
import { useUnityContext } from "react-unity-webgl";
import Header from "../components/Header";
import UnityGame from "../components/UnityGame";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../type/type";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const flow = useAptimusFlow();

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
  useEffect(() => {
    test();
  }, []);
  const { setAuth, auth } = useAuth();

  const test = async () => {
    const session = await flow.getSession();
    const user: User = jwtDecode(session.jwt ?? "");

    // Map the decoded JWT object to the User interface

    if (user) {
      setAuth(user);
      console.log(auth);
    }
  };
  return (
    <>
      <div className="unity-container">
        <UnityGame
          unityProvider={unityProvider}
          isLoaded={isLoaded}
          loadingProgression={loadingProgression}
        />
      </div>
    </>
  );
};

export default Home;
