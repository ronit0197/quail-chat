import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'
import { AuthContext } from '../Context/AuthContext'

const Navbar = () => {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
        <img src="./logo.png" alt="LOGO" className='logo' />
        <div className="current-user">
            <img src={currentUser.photoURL} alt="avatar" className='avatar' />
            <span className='current-user-name'>{currentUser.displayName}</span>
            <button onClick={()=>signOut(auth)}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar