import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'

const Massage = ({massage}) => {
  const {currentUser} = useContext(AuthContext)
  const { data } = useContext(ChatContext)
  
  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({ behavior: "smooth" });
  },[massage])

  return (
    <div ref={ref} className={`massage ${massage.senderId === currentUser.uid && "owner"}`}>
        <div className="massageInfo">
            <img src={massage.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="avatar" />
            <span>Justnow</span>
        </div>
        <div className="massageContent">
            <p>{massage.text}</p>
            { massage.img && <img src={massage.img} alt="content-pic" />}
        </div>
    </div>
  )
}

export default Massage