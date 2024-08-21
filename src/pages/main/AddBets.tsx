import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { Buffer } from "buffer";
import { SendButton } from "../../components/SendButton/SendButton";

const AddBets: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const hexToUint8Array = (hex: string): Uint8Array => {
    return Uint8Array.from(Buffer.from(hex.slice(2), "hex"));
  };
  

  const createRoomContract = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

  }
  const address = localStorage.getItem("address")
  // const pickWinnerByRoomId = async () => {
  //   const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  //   const aptos = new Aptos(aptosConfig);

  //   const privateKey = new Ed25519PrivateKey("0x0cdae4b8e4a1795ffc36d89ebbbdd7bd0cb0e0d81091290096f8d92d40c1fe43");
    
  //   const account = await Account.fromPrivateKey({ privateKey });
  
  
  //   // Get the account address
  //   const accountAddress = account.accountAddress.toString();
  
  //   console.log("Account Address:", accountAddress);
  //   const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::pick_winner_and_transfer_bet`;

  //   try {
  //     const transaction = await aptos.transaction.build.simple({
  //       sender: accountAddress, // Use the address as a string
  //       data: {
  //         function: FUNCTION_NAME,
  //         functionArguments: [
  //           Number(1723050710),
  //           "0xae93702b20fa4ce18cb54c4ab9e3bcd5feb654d8053a10b197f89b4759f431d8", // Address as a string
  //         ],
  //       },
  //     });

  //     // Sign and submit the transaction
  //     const pendingTransaction = await aptos.signAndSubmitTransaction({
  //       signer: account,
  //       transaction,
  //     });

  //     // Wait for the transaction to be completed
  //     const executedTransaction = await aptos.waitForTransaction({
  //       transactionHash: pendingTransaction.hash,
  //     });

  //     // Log the executed transaction
  //     console.log("Executed Transaction:", executedTransaction);
  //   } catch (error) {
  //     // type-ignore
  //     console.error("Mã Lỗi:", error.status);
  //     console.error("Lỗi khi gọi hàm smart contract:", error);
  //   }
  // };
  // async function callFaucet(amount: number, address: string): Promise<string []> {
  //   const faucetClient = new AptosFaucetClient({
  //     BASE: "https://faucet.devnet.aptoslabs.com",
  //   });
  //   const request: FundRequest= {
  //     amount,
  //     address,
  //   };
  //   // @ts-ignore
  //   const response = await faucetClient.fund({ requestBody: request });
  //   return response.txn_hashes;
  // }
  const testFunction = async()=>{
    const address = localStorage.getItem("address")
    // const a = await callFaucet(1,address!)
    // console.log(a)
  }
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       <SendButton walletAddress={address || ""} type={Network.TESTNET}>
            Faucet
          </SendButton>
    </Box>
  );
};


export default AddBets;
