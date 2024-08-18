import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Compare } from "../../utils/CompareAddress";
import useGetPlayer from "../../hooks/useGetPlayer";
interface Pros {
  message: string;
  sender: string;
}
const Messenger = ({ message, sender }: Pros) => {
  const { auth } = useAuth();
  const address = localStorage.getItem("address");
  // const fromMe = sender.slice(-5).toLowerCase() === address?.slice(-5).toLowerCase();
  const fromMe = Compare(sender, address!, 5);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const {fetchPlayer, loadingFetch}= useGetPlayer()
  const [image, setImage]=useState<string>("")
  useEffect(()=>{
		getAnother()
	
	
  },[])
  const getAnother = async()=>{
	const p2 = await fetchPlayer(sender)
	setImage(p2?.user_image??"")
  }
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={image} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} `}>
        {message}
      </div>
      {/* <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12313</div> */}
    </div>
  );
};

export default Messenger;
