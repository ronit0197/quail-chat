import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../Firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Send = () => {

  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {

    if (img) {

      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, img)

      uploadTask.on('state_changed',
        (snapshot) => {

          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log('Unknown state: ' + snapshot.state);
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            await updateDoc(doc(db, "chats", data.chatId), {
              massages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            })

          });
        }
      );

    } else {

      await updateDoc(doc(db, "chats", data.chatId), {
        massages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })

    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMassage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    })
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMassage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    })

    setText("")
    setImg(null)

  }

  return (
    <div className='send-massage'>
      <input type="text" placeholder='Write your massage here...' onChange={e => setText(e.target.value)} value={text} />
      <div className="attachment">
        <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          {img && <div className="file-indicator">1</div>}
          <i className="fa-solid fa-paperclip"></i>
          <i className="fa-regular fa-image"></i>
        </label>
        <i className="fa-solid fa-paper-plane send" onClick={handleSend}></i>
      </div>
    </div>
  )
}

export default Send