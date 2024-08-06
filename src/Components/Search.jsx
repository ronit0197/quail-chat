import React, { useContext, useState } from 'react'
import { collection, query, where, doc, setDoc, updateDoc, serverTimestamp, getDoc, getDocs } from "firebase/firestore";
import { db } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

const Search = () => {

  const [userName, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false)

  const {currentUser} = useContext(AuthContext)

  const handleSearch = async () => {

    const user = collection(db, "users");

    const displayName = "displayName";

    const q = query(user, where(displayName, "==", userName));

    try{

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });

    }catch(error){
      setError(true)
    }


  }

  // const handleKey = () => {
  //    handleSearch();
  // }

  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    const res = await getDoc(doc(db, "chats", combinedId));

    if(!res.exists()){

      await setDoc(doc(db,"chats", combinedId), { massages: [] })


      // Create chats
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId+".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
      });
      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId+".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
      });

    }
    setUser(null)
    setUsername("")
  }
  return (
    <div className='search'>
      <input type="text" placeholder='Find friends' onKeyUp={handleSearch} onChange={(e) => setUsername(e.target.value)} value={userName} />
        {error && <span>User not found</span>}
        {user && <div className="user" onClick={handleSelect}>
        <img src={user.photoURL} alt="avatar" />
        <div className="user-info">
          <span className='name'>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search