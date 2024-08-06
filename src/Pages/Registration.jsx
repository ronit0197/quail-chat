import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/loader.gif'

const Registration = () => {

    const [error, setError] = useState(false);
    const navigate = useNavigate()
    const [isLogin, setIslogin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password) //Register user with email and password

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

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
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                        await updateProfile(res.user,{
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "userChats", res.user.uid), {})

                        navigate("/")
                    });
                }
            );


        } catch (error) {
            setError(true)
        }

        setIslogin(true)

    }

    return (
        <div className='container'>
            <div className="wraper">
                <img src="./logo.png" alt="LOGO" />
                <span className='title'>Registration</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Enter your name' />
                    <input type="email" placeholder='Enter email id' />
                    <input type="password" placeholder='Enter password' />
                    <input style={{ display: "none" }} type="file" id="avatar" />
                    <label htmlFor="avatar">
                        <div className="avatar">
                            <img src="./avatar.png" alt="avatar" />
                        </div>
                        <span>Add avatar</span>
                    </label>
                    {error && <span style={{color:"red", fontSize:"10px"}}>User have already exist</span>}
                    <button id="register">{isLogin ? <img src={Loader} alt="Loader" /> : "Register"}</button>
                </form>
                <span className='bottom-text'>Already have an account? <Link to="/login">Login</Link></span>
            </div>
        </div>
    )
}

export default Registration