import { FaucetClient } from "aptos";
import { sanitizeAddress } from "../utils/sanitizeAddress";

const NODE_URL_DEVNET = "https://fullnode.devnet.aptoslabs.com/v1";
const FAUCET_URL_DEVNET = "https://faucet.devnet.aptoslabs.com";

const NODE_URL_TESTNET = "https://fullnode.testnet.aptoslabs.com/v1";
const FAUCET_URL_TESTNET = "https://faucet.testnet.aptoslabs.com";

const networkWithFaucet = {
  devnet: {
    NODE_URL: NODE_URL_DEVNET,
    FAUCET_URL: FAUCET_URL_DEVNET,
  },
  testnet: {
    NODE_URL: NODE_URL_TESTNET,
    FAUCET_URL: FAUCET_URL_TESTNET,
  },
};

export const useSendAptos = (
  walletAddress: string,
  network: "devnet" | "testnet"
) => {
  return (
    async () => {
      const NODE_URL = networkWithFaucet[network].NODE_URL;
      const FAUCET_URL = networkWithFaucet[network].FAUCET_URL;

      const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

      return await faucetClient.fundAccount(walletAddress, 1e9 * Number(1));
    });
};
