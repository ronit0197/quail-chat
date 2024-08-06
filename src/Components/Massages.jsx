import React, { useContext, useEffect, useState } from 'react'
import Massage from './Massage'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase'

const Massages = () => {

  const [massages, setMassages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
      doc.exists() && setMassages(doc.data().massages)
    })

    return ()=>{
      unsub()
    }
  },[data.chatId])

  return (
    <div className='massages'>
      {massages.map((m) =>(
        <Massage massage={m} key={m.id}/>
      ))}
      <h1 className={`alert ${massages.length != 0 && "off"}`}>Please find your friend & select to start conversation</h1>
    </div>
  )
}

export default Massages