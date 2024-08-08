import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import WaitingRoom from '../../components/create-room/WaitingRoom';
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";

const AddBets: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pickWinnerByRoomId = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const privateKeyHex = "0x0cdae4b8e4a1795ffc36d89ebbbdd7bd0cb0e0d81091290096f8d92d40c1fe43";
    const account = new Account(privateKeyHex);

    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::pick_winner_and_transfer_bet`;

    try {
      const payload = {
        function: FUNCTION_NAME,
        type_arguments: [],
        arguments: [
          1723050710, // Room ID
          "0xae93702b20fa4ce18cb54c4ab9e3bcd5feb654d8053a10b197f89b4759f431d8" // Address
        ]
      };

      const transaction = await aptos.transaction.build({
        sender: account.address(),
        payload,
      });

      const signedTxn = await aptos.signTransaction(account, transaction);
      const txnHash = await aptos.submitTransaction(signedTxn);

      await aptos.waitForTransaction(txnHash);

      console.log("Transaction hash:", txnHash);
    } catch (error) {
      console.error("Error Status:", error.status);
      console.error("Error calling smart contract function:", error);
    }
  };

  return (
    <Box>
      <Button onClick={pickWinnerByRoomId}>Pick Winner</Button>
      <WaitingRoom open={open} handleClose={handleClose} />
    </Box>
  );
};

export default AddBets;