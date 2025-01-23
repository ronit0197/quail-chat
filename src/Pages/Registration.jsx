import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/loader.gif';

const Registration = () => {
    const [error, setError] = useState("");
    const [isLogin, setIslogin] = useState(false);
    const [fileName, setFileName] = useState(""); // State for storing the file name
    const [isUploading, setIsUploading] = useState(false);
    const [uploadData, setUploadData] = useState(0);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // Update the file name
        }
    };

    const truncateFileName = (name, maxLength = 20) => {
        if (name.length <= maxLength) return name;
        const ext = name.split('.').pop(); // Get the file extension
        const baseName = name.substring(0, maxLength - ext.length - 3); // Truncate the base name
        return `${baseName}...${ext}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        const displayName = e.target[0].value.trim();
        const email = e.target[1].value.trim();
        const password = e.target[2].value.trim();
        const file = e.target[3].files[0];

        // Validation for empty fields
        if (!displayName) {
            setError("Please enter your name.");
            return;
        }
        if (!email) {
            setError("Please enter your email.");
            return;
        }
        if (!password) {
            setError("Please enter your password.");
            return;
        }
        if (!file) {
            setError("Please upload an avatar.");
            return;
        }

        setIslogin(true); // Show loader

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password); // Register user
            const storageRef = ref(storage, `${displayName}_${Date.now()}`); // Unique file reference
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setIsUploading(true)
                    setUploadData(progress)
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    setError("Failed to upload avatar. Please try again.");
                    setIslogin(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/");
                }
            );
        } catch (err) {
            setError("User already exists or an error occurred. Please try again.");
        } finally {
            setIslogin(false); // Hide loader
        }
    };

    return (
        <div className='container'>
            <div className="wraper">
                <img src="./logo.png" alt="LOGO" />
                <span className='title'>Registration</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Enter your name' />
                    <input type="email" placeholder='Enter email id' />
                    <input type="password" placeholder='Enter password' />
                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="avatar"
                        onChange={handleFileChange} // Update file name when a file is chosen
                    />
                    <label htmlFor="avatar">
                        <div className="avatar">
                            <img src="./avatar.png" alt="avatar" />
                        </div>
                        {
                            fileName ?
                                fileName && <span style={{ marginLeft: "10px", fontSize: "12px" }}>{truncateFileName(fileName)}</span>
                                :
                                <span>Add avatar</span>
                        }
                    </label>
                    {error && <span style={{ color: "red", fontSize: "10px" }}>{error}</span>}
                    {
                        isUploading ?
                            <button id="register" disabled>Uploading {uploadData} %</button>
                            :
                            <button id="register">
                                {isLogin ? <img src={Loader} alt="Loader" style={{ height: '20px' }} /> : "Register"}
                            </button>
                    }
                </form>
                <span className='bottom-text'>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </div>
        </div>
    );
};

export default Registration;