import React, { useContext, useEffect, useState } from 'react';
import Massage from './Massage';
import { ChatContext } from '../Context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';

const Massages = () => {
  const [massages, setMassages] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data?.chatId) {
      setIsLoading(false); // Stop loading if no chatId
      return;
    }

    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMassages(doc.data()?.massages || []);
      }
      setIsLoading(false); // Stop loading after data fetch
    });

    return () => {
      unsub();
    };
  }, [data?.chatId]);

  return (
    <div className="massages">
      {isLoading ? (
        <div className="alert">Loading messages...</div>
      ) : massages.length === 0 ? (
        <h1 className="alert">No chats at this point</h1>
      ) : (
        massages.map((m) => (
          <Massage massage={m} key={m.id || Math.random()} />
        ))
      )}
    </div>
  );
};

export default Massages;