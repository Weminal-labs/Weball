import React, { useEffect, useState } from 'react'
import Messenger from './Messenger'
import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk'
import { MODULE_ADDRESS } from '../../utils/Var'

interface Pros {
  roomId: string
}

interface MessageType {
  message: string,
  sender: string,
  timestamp: string
}

const Messengers = ({ roomId }: Pros) => {
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const getChatMessage = async () => {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_chat_messages`,
        functionArguments: [roomId]
      };

      const data = await aptos.view({ payload });
      setMessages(data[0])
    }

    getChatMessage(); // Initial call
    const intervalId = setInterval(getChatMessage, 1000); // Subsequent calls every 1 second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [roomId])

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((ele, index) => (
        <Messenger key={ele.timestamp} message={ele.message} sender={ele.sender} />
      ))}
    </div>
  )
}

export default Messengers
