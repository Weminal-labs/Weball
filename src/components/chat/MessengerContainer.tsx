import React from 'react'
import Messenger from './Messenger'
import MessengerInput from './MessengerInput'
import Messengers from './Messengers'
interface Pros{
    roomId:string
}
const MessengerContainer = ({roomId}:Pros) => {
  return (
    <div className='flex flex-col justify-around h-full w-[400px]'>
      <Messengers roomId={roomId} />
      <MessengerInput  roomId={roomId}  />
    </div>
  )
}

export default MessengerContainer
