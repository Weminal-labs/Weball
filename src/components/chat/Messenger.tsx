import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Compare } from '../../utils/CompareAddress'
interface Pros{
    message:string,
    sender:string,


}
const Messenger = ({message,sender}:Pros) => {
    const {auth}=useAuth()
    const address =localStorage.getItem("address")
    // const fromMe = sender.slice(-5).toLowerCase() === address?.slice(-5).toLowerCase();
	const fromMe = Compare(sender,address!,5)
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
    console.log("sender " +sender+"a")

  return (
    <div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={auth?.picture} />
				</div>
			</div>
			<div className={`chat-bubble text-white  ${bubbleBgColor}  `}>{message}</div>
			{/* <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12313</div> */}
		</div>
  )
}

export default Messenger
