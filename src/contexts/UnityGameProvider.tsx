import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  useUnityContext,
  Unity,
} from "react-unity-webgl";
import { MODULE_ADDRESS } from "../utils/Var";
import { Compare } from "../utils/CompareAddress";
import { useAlert } from "./AlertProvider";

// Create UnityGame context
const UnityGameContext = createContext<any>(null);

interface GameProviderProps {
  children: ReactNode;
}
interface PickWinner {
  roomId: string;
  userId: string;
}
export const UnityGameProvider: React.FC<GameProviderProps> = ({
  children,
}) => {
  const {
    sendMessage,
    isLoaded,
    unityProvider,
    addEventListener,
    removeEventListener,
    unload,
  } = useUnityContext({
    loaderUrl: "build/Build/Build.loader.js",
    dataUrl: "build/Build/Build.data",
    frameworkUrl: "build/Build/Build.framework.js",
    codeUrl: "build/Build/Build.wasm",
  });
  const { setAlert } = useAlert();

  const [show, setShow] = useState(false);
  const handleUnload = async () => {
    await unload();
  };

  const pickWinnerByRoomId = async (roomId: number, winner: string) => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    console.log(import.meta.env.VITE_SECRET_KEY)
    const privateKey = new Ed25519PrivateKey(
      import.meta.env.VITE_SECRET_KEY,
    );

    const account = await Account.fromPrivateKey({ privateKey });

    const accountAddress = account.accountAddress.toString();

    console.log("Account Address:", accountAddress);
    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::pick_winner_and_transfer_bet`;

    try {
      const transaction = await aptos.transaction.build.simple({
        sender: accountAddress, 
        data: {
          function: FUNCTION_NAME,
          functionArguments: [
            roomId,
            winner, 
          ],
        },
      });

      // Sign and submit the transaction
      const pendingTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      // Wait for the transaction to be completed
      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      // Log the executed transaction
      console.log("Executed Transaction:", executedTransaction);
      const alertContent = 
        <>
          Transaction:{" "}
          <a
            href={`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=testnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {executedTransaction.hash}
          </a>
        </>
    
      
      setAlert(alertContent, "success"); 
    } catch (error) {
          // @ts-ignore

      console.error("Mã Lỗi:", error.status);
      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
  };
  const handleUnityApplicationQuit = useCallback(() => {
 

    setShow(false);
    unload();
  
  }, []);
  const handleUnityApplicationFinish = useCallback((jsonData: any) => {
    const data: PickWinner = JSON.parse(jsonData);
    const address = localStorage.getItem("address")

  
    if(Compare(data.userId,address!,5)){
        console.log("Data received from Unity on quit:", data.userId);
        pickWinnerByRoomId(Number(data.roomId),data.userId)

    }
  }, []);
  useEffect(() => {
    // Add the event listener
    addEventListener("ExitGame", handleUnityApplicationQuit);
    addEventListener("FinishGame", handleUnityApplicationFinish);

    // Clean up the event listener on unmount
    return () => {
      removeEventListener("ExitGame", handleUnityApplicationQuit);
      removeEventListener("FinishGame", handleUnityApplicationFinish);

    };
  }, [addEventListener, removeEventListener, handleUnityApplicationQuit,handleUnityApplicationFinish]);

  return (
    <UnityGameContext.Provider
      value={{
        sendMessage,
        isLoaded,
        unityProvider,
        show,
        setShow,
        handleUnload,
      }}
    >
      {children}
    </UnityGameContext.Provider>
  );
};

export default UnityGameContext;
