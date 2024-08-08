import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import React, { useState } from 'react'
import { MODULE_ADDRESS } from '../../utils/Var';
import { AptimusNetwork } from 'aptimus-sdk-test';
import { useAptimusFlow } from 'aptimus-sdk-test/react';
import { BsSend } from 'react-icons/bs';
interface Pros{
    roomId:string
}
const MessengerInput = ({roomId}:Pros) => {
    const [message, setMessage] = useState("");
    const flow = useAptimusFlow();
    const [loading, setLoading] = useState();
    const address = localStorage.getItem("address")
    
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};
    const sendMessage =async (message:string)=>{
        const aptosConfig = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(aptosConfig);
        const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::send_chat_to_room_id`;

        const transaction = await aptos.transaction.build.simple({

            sender: address ?? "",
            data: {
              function: FUNCTION_NAME,
              functionArguments: [roomId, message],
            },
          });
          const committedTransaction = await flow.executeTransaction({

            aptos,
            transaction,
            network: AptimusNetwork.TESTNET,
          });
    }
	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
}

export default MessengerInput
