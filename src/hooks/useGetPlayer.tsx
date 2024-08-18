import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk';
import React, { useState } from 'react';
import { MODULE_ADDRESS } from '../utils/Var';
import { PlayerInfo } from '../type/type';

const useGetPlayer = () => {
  const [loadingFetch, setLoadingFetch] = useState(false);

  const fetchPlayer = async (address: string): Promise<PlayerInfo|null > => {
 

    try {
      setLoadingFetch(true);

      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
        functionArguments: [address],
      };

      const response = await aptos.view({ payload });
      // @ts-ignore
      const playerData: PlayerInfo = response[0]
      // Handle the response (e.g., set user data)
      return playerData
          
    } catch (error) {
      setLoadingFetch(false);
      console.error("Error fetching player info:", error);
        
    }
    return null
  };

  return { fetchPlayer, loadingFetch };
};

export default useGetPlayer;
