import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import React, { useState } from 'react'
import { MODULE_ADDRESS } from '../../utils/Var';
import { AptimusNetwork } from 'aptimus-sdk-test';
import { useAptimusFlow } from 'aptimus-sdk-test/react';
import { BsSend } from 'react-icons/bs';
import useContract from '../../hooks/useContract';
import { useAlert } from '../../contexts/AlertProvider';
interface Pros{
    roomId:string
}
const MessengerInput = ({roomId}:Pros) => {
    const [message, setMessage] = useState("");
    const flow = useAptimusFlow();
    const [loading, setLoading] = useState();
    const address = localStorage.getItem("address")
    const { callContract, error } = useContract();
  const{setAlert} =useAlert()
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
	};
  
    const sendMessage =async (message:string)=>{
      setMessage("");

        await callContract({
          functionName:"send_chat_to_room_id",
          functionArgs: [roomId, message],
          onSuccess(result) {
          },
          onError(error) {
            setAlert("Please re-send message after 5s","warning")
            console.error("Lỗi khi gọi hàm smart contract:", error);
          },

        })
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
