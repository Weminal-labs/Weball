import { FaucetClient } from "aptos";
import { sanitizeAddress } from "../utils/sanitizeAddress";

const NODE_URL_DEVNET = "https://aptos.devnet.inola.movementlabs.xyz/v1";
const FAUCET_URL_DEVNET = "https://faucet.devnet.inola.movementlabs.xyz";

const NODE_URL_TESTNET = "https://aptos.testnet.suzuka.movementlabs.xyz/v1/";
const FAUCET_URL_TESTNET = "https://faucet.testnet.suzuka.movementlabs.xyz/";

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

export const useSendAptos = (walletAddress: string, network: "devnet" | "testnet") => {
  return async () => {
    const NODE_URL = networkWithFaucet[network].NODE_URL;
    const FAUCET_URL = networkWithFaucet[network].FAUCET_URL;

    try {
      const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
      const response = await faucetClient.fundAccount(walletAddress, 1e10 * Number(1));
      console.log("Faucet response:", response);
      return response;
    } catch (error) {
      console.error("Error funding account:", error);
      throw error;
    }
  };
};