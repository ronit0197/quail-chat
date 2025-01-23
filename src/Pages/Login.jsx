import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/loader.gif';

const Login = () => {
    const [error, setError] = useState("");
    const [isLogin, setIslogin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset the error message

        const email = e.target[0].value.trim();
        const password = e.target[1].value.trim();

        // Validate fields
        if (!email) {
            setError("Please fill in the email.");
            return;
        }
        if (!password) {
            setError("Please fill in the password.");
            return;
        }

        setIslogin(true); // Start the loader
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // Redirect on successful login
        } catch (error) {
            setError("Invalid Email or Password!");
        } finally {
            setIslogin(false); // Stop the loader
        }
    };

    return (
        <div className='container'>
            <div className="wraper">
                <img src="./logo.png" alt="LOGO" />
                <span className='title'>Login</span>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder='Email Id' />
                    <input type="password" placeholder='Password' />
                    {error && <span style={{ color: "red", fontSize: "10px" }}>{error}</span>}
                    <button>
                        {isLogin ? <img src={Loader} alt="Loader" style={{ height: '20px' }} /> : "Login"}
                    </button>
                </form>
                <span className='bottom-text'>
                    Don't have an account? <Link to="/register">Register</Link>
                </span>
            </div>
        </div>
    );
};

export default Login;