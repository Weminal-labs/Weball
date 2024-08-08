import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Account, Aptos, AptosConfig, Network, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";

const AddBets: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function uint8ArrayToHex(uint8Array: Uint8Array): string {
    return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  const createRoomContract = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const privateKeyHex = "0x0cdae4b8e4a1795ffc36d89ebbbdd7bd0cb0e0d81091290096f8d92d40c1fe43";
    const privateKeyBytes = Buffer.from(privateKeyHex.slice(2), "hex");
    const privateKey = new Secp256k1PrivateKey(privateKeyBytes);
    const account = Account.fromPrivateKey({ privateKey });

    // Chuyển đổi địa chỉ tài khoản thành chuỗi hex
    const accountAddress = uint8ArrayToHex(account.accountAddress.data);
    console.log("Account Address (Hex):", accountAddress);

    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::pick_winner_and_transfer_bet`;

    try {
      const transaction = await aptos.transaction.build.simple({
        sender: accountAddress, // Sử dụng địa chỉ đã chuyển đổi
        data: {
          function: FUNCTION_NAME,
          functionArguments: [
            Number(1723050710),
            "0xae93702b20fa4ce18cb54c4ab9e3bcd5feb654d8053a10b197f89b4759f431d8", // Address as a string
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
    } catch (error) {
      console.error("Mã Lỗi:", error.status);
      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
  };

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
      <Button variant="contained" onClick={createRoomContract}>
        Test contract
      </Button>
    </Box>
  );
};

export default AddBets;
