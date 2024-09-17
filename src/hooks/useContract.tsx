import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useState } from "react";
import { MODULE_ADDRESS } from "../utils/Var";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
import { useWallet } from "@aptos-labs/wallet-adapter-react";


interface useContractProps {
  functionName: string;
  functionArgs: any[];
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  // const flow = useAptimusFlow();
  const { signAndSubmitTransaction, disconnect}=useWallet()
  const callContract = async ({
    functionName,
    functionArgs,
    onSuccess,
    onError,
    onFinally,
  }: useContractProps) => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const address = localStorage.getItem("address")

    try {
      setLoading(true);
      setError(null);

      const response = await signAndSubmitTransaction({
        sender: address ?? "",
        data: {
          function: `${MODULE_ADDRESS}::gamev3::${functionName}`,
          functionArguments: functionArgs,
        },
      });

      const committedTransaction=await aptos.waitForTransaction({ transactionHash: response.hash });

      if (onSuccess) {
        onSuccess(committedTransaction);
      }
    } catch (error: any) { 
      console.log(error.message)
      // if (error.status === 400) {
      //   disconnect
      //   localStorage.clear()
      //   window.location.reload();
      // }
      // if(error.message==="Missing required data for execution."){
      //   disconnect        
        
      //   localStorage.clear()
      //   window.location.reload();
      // }
      // Handle error here
      setError(error.toString());
      if (onError) {
        
        onError(error);
      }
    } finally {
      setLoading(false);
      if (onFinally) {
        onFinally();
      }
    }
  };

  return { callContract, loading, error };
};

export default useContract;