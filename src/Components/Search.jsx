import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

const Search = () => {
  const [userName, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const searchRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const userCollection = collection(db, 'users');
        const querySnapshot = await getDocs(userCollection);
        const users = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.uid !== currentUser.uid) { // Exclude the current user
            users.push(userData);
          }
        });
        setAllUsers(users);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchAllUsers();

    // Hide dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentUser.uid]);

  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim() === '') {
      setUser(null);
      setError(false);
      return;
    }

    const userCollection = collection(db, 'users');
    const displayName = 'displayName';
    const q = query(userCollection, where(displayName, '==', searchTerm));

    try {
      const querySnapshot = await getDocs(q);
      let foundUser = null;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.uid !== currentUser.uid) { // Exclude the current user
          foundUser = userData;
        }
      });
      setUser(foundUser);
      setError(!foundUser);
    } catch (err) {
      console.error('Error during search:', err);
      setError(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // Clear previous debounce timeout
    clearTimeout(debounceTimeoutRef.current);

    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch(value); // Perform search after delay
    }, 500); // Adjust debounce delay as needed (500ms here)
  };

  const handleSelect = async (selectedUser) => {
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      // Create or fetch the chat document
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // Create a new chat document
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        // Update userChats for the current user
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        // Update userChats for the selected user
        await updateDoc(doc(db, 'userChats', selectedUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }

      setUser(null);
      setUsername('');
      setShowDropdown(false);
    } catch (err) {
      console.error('Error during chat creation:', err);
    }
  };

  return (
    <div className="search" ref={searchRef}>
      <input
        type="text"
        placeholder="Find friends"
        onFocus={() => setShowDropdown(true)}
        onChange={handleInputChange} // Use handleInputChange instead
        value={userName}
      />
      {showDropdown && (
        <div className="dropdown">
          {error && <span style={{ padding: '10px', color: 'gray' }}>User not found</span>}
          {!userName.trim() &&
            allUsers.map((u) => (
              <div
                key={u.uid}
                className="user"
                onClick={() => handleSelect(u)}
              >
                <img src={u.photoURL} alt="avatar" />
                <div className="user-info">
                  <span className="name">{u.displayName}</span>
                </div>
              </div>
            ))}
          {user && (
            <div className="user" onClick={() => handleSelect(user)}>
              <img src={user.photoURL} alt="avatar" />
              <div className="user-info">
                <span className="name">{user.displayName}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;