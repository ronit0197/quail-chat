import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';

const Massage = ({ massage }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  // Scroll to the latest message
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [massage]);

  // Function to format the timestamp based on the difference from the current time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time'; // Fallback if no timestamp

    const now = new Date();
    const messageDate = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    // Check if the message is from the same day
    const isSameDay =
      now.getFullYear() === messageDate.getFullYear() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getDate() === messageDate.getDate();


    console.log("same day:", isSameDay)

    // If the message was sent within the last 60 seconds, show "Just now"
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // If the message is sent within the last 60 minutes, show minutes ago
    else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes} min ago`;
    }

    // If the message is sent within the last 24 hours, show hours ago
    else if (diffInSeconds < 18000) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    // If it's from a different day, show the date
    else if (!isSameDay) {
      return messageDate.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    return 'Invalid time'; // Fallback if none of the conditions are met
  };


  return (
    <div
      ref={ref}
      className={`massage ${massage.senderId === currentUser.uid && 'owner'}`}
    >
      <div className="massageInfo">
        <img
          src={massage.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt="avatar"
        />
        <span>{formatTimestamp(massage.date)}</span>
      </div>
      <div className="massageContent">
        <p>{massage.text}</p>
        {massage.img && <img src={massage.img} alt="content-pic" />}
      </div>
    </div>
  );
};

export default Massage;