import React, { useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase"
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/loader.gif'

const Login = () => {

    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [isLogin, setIslogin] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try{

            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
            
        }catch(error){
            setError(true)
        }
        
        setIslogin(true)

    }

    return (
        <div className='container'>
            <div className="wraper">
                <img src="./logo.png" alt="LOGO" />
                <span className='title'>Login</span>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder='Email Id' />
                    <input type="password" placeholder='Password' />
                    {error && <span style={{color:"red", fontSize:"10px"}}>Invalid Email or Password!</span>}
                    <button>{isLogin ? <img src={Loader} alt="Loader" /> : "Login"}</button>
                </form>
                <span className='bottom-text'>Don't have an account? <Link to="/register">Register</Link></span>
            </div>
        </div>
    )
}

export default Login