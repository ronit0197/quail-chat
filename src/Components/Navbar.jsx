import React, { useContext, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'

const Navbar = () => {

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      dispatch({ type: "RESET_CHAT" }); // Reset ChatContext
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className='navbar'>
      <img src="./logo.png" alt="LOGO" className='logo' />
      <div className="current-user">
        <img src={currentUser.photoURL} alt="avatar" className='avatar' />
        <span className='current-user-name'>{currentUser.displayName}</span>
        <button onClick={handleLogout} disabled={isLoggingOut}>{isLoggingOut ? 'Logging out..' : 'Logout'}</button>
      </div>
    </div>
  )
}

export default Navbar