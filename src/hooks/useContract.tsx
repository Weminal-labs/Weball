import { AccountAuthenticator, Aptos, AptosConfig, Deserializer, Network, SimpleTransaction } from "@aptos-labs/ts-sdk";
import { useState } from "react";
import { MODULE_ADDRESS } from "../utils/Var";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { fromB64, toB64 } from "../utils/HelpersFunction";
import axios from "axios";


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
  const { signAndSubmitTransaction, disconnect,    signTransaction,
  }=useWallet()
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

      // const response = await signAndSubmitTransaction({
      //   sender: address ?? "",
      //   data: {
      //     function: `${MODULE_ADDRESS}::gamev3::${functionName}`,
      //     functionArguments: functionArgs,
      //   },
      // });

      // const committedTransaction=await aptos.waitForTransaction({ transactionHash: response.hash });
      const txn = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: `${MODULE_ADDRESS}::gamev3::${functionName}`,
          functionArguments: functionArgs,
        },
        withFeePayer: true,
      });

      console.log(toB64(txn.bcsToBytes()), address);
      const txbBase64 = toB64(txn.bcsToBytes());

      const { sponsorAuthBytesBase64, sponsorSignedTransactionBytesBase64 } = (
        await axios.post(
          "https://aptimus-gas-pool.weminal.com/v1/transaction-blocks/sponsor",
          {
            network: "testnet",
            transactionBytesBase64: txbBase64,
            sender: address,
          },
        )
      ).data.data;

      console.log(sponsorSignedTransactionBytesBase64, sponsorAuthBytesBase64);

      const deserializer = new Deserializer(fromB64(sponsorAuthBytesBase64));
      const feePayerAuthenticator =
        AccountAuthenticator.deserialize(deserializer);

      // deserialize raw transaction
      const deserializerTransaction = new Deserializer(
        fromB64(sponsorSignedTransactionBytesBase64),
      );

      const sponsorSignedTransaction = SimpleTransaction.deserialize(
        deserializerTransaction,
      );

      const senderAuth = await signTransaction(sponsorSignedTransaction);

      const response = await aptos.transaction.submit.simple({
        transaction: sponsorSignedTransaction,
        senderAuthenticator: senderAuth,
        feePayerAuthenticator,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      if (onSuccess) {
        onSuccess(executedTransaction);
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