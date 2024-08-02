import React from 'react'
import useAuth from '../../hooks/useAuth'
interface Pros{
    message:string,
    sender:string,


}
const Messenger = ({message,sender}:Pros) => {
    const {auth}=useAuth()
    const address =localStorage.getItem("address")
    const fromMe = sender.slice(-5).toLowerCase() === address?.slice(-5).toLowerCase();
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
    console.log("sender " +sender+"a")
// console.log("address " +address+"a")
// console.log("sender " +sender.length)
// console.log("address " +address?.length)
// console.log(fromMe)

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
