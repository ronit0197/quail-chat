import React, { useContext } from 'react'
import Massages from './Massages'
import Send from './Send'
import { ChatContext } from '../Context/ChatContext'

const Chatbox = () => {

  const { data } = useContext(ChatContext);

  return (
    <div className='chatbox'>
        <div className="chat-info">
            <span className="friend-name">{data.user?.displayName}</span>
            <div className='addition'>
                <i className="fa-solid fa-video"></i>
                <i className="fa-solid fa-user-plus"></i>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
        </div>
        <Massages />
        <Send />
    </div>
  )
}

export default Chatbox