import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';

const Chats = () => {

    const [chats, setChats] = useState([])

    const { currentUser } = useContext(AuthContext)
    const { dispatch } = useContext(ChatContext)

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
            });

            return () => {
                unsub();
            }
        }

        currentUser.uid && getChats()

    }, [currentUser.uid]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    }

    return (
        <div className="chats">
            {chats && Object.entries(chats)?.length === 0 && (
                <div style={{ padding: '10px', color: 'gray' }}>No chats found</div> // Empty state message
            )}
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div className="user" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    <img src={chat[1].userInfo.photoURL} alt="avatar" />
                    <div className="user-info">
                        <span className='name'>{chat[1].userInfo.displayName}</span>
                        <p style={{ fontSize: "10px", color: "lightgray", marginLeft: "10px" }}>{chat[1].lastMassage?.text || 'No message yet'}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats