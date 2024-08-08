import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk';
import React, { useEffect, useState } from 'react'
import { RoomType } from '../type/type';
import { MODULE_ADDRESS } from '../utils/Var';

const useGetRoom = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rooms, setRooms] = useState<RoomType[]>([]);
  
    const getRooms = async () => {
      setIsLoading(true);
  
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_all_rooms`,
      };
  
      const data = await aptos.view({ payload });
      setIsLoading(false);
      // @ts-ignore
      setRooms(data[0]);
    };
  
    useEffect(() => {
      getRooms();
    }, []);
  
    return { rooms, isLoading, getRooms ,setIsLoading};
}

export default useGetRoom
