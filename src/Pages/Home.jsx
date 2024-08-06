import React from 'react'
import Sidebar from '../Components/Sidebar'
import Chatbox from '../Components/Chatbox'

const Home = () => {
  

  return (
    <div className='home'>
        <div className="wraper">
            <Sidebar />
            <Chatbox />
        </div>
    </div>
  )
}

export default Home