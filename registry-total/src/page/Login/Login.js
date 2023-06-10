import React from "react";
import './Login.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../redux/auth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isMissing, setIsMissing] = useState(false)

    const isLoading = useSelector(
        (state) => state.auth.isLoading[1]
    )
    const message = useSelector(
        (state) => state.auth.message
    )
    const isError = useSelector(
        (state) => state.auth.isError[1]
    )
    const dispatch = useDispatch();

    useEffect(() => {
        if (isError) {
            toast.error(message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                onClose: () => dispatch(reset())
            })
           
        }
        toast.clearWaitingQueue();
    }, [isError, message, dispatch])

    const handleLogin = (e) => {
        e.preventDefault()
        if (!username || !password) {
            console.log('hi')
            setIsMissing(true)
            return toast.error("All field is required", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                onClose: () => setIsMissing(false)
            })
        } else {
            dispatch(login({username, password}));
        }
    }
    
    return (
        <>
        <ToastContainer limit={1}/>
        <div className="login-container">
            <div className="login">
                <div className="login-banner">
                    <div className="logo">
                        <p><FontAwesomeIcon icon={faCar} className="icon"/> Registry Total</p>
                    </div>
                    <div className="welcome">
                        <h1>Welcome to{'\u00A0'}Registry Total</h1>
                        <p>Please sign in to continune</p>
                    </div>
                </div>
                <div className="login-form">
                    <form className="form">
                        <div className="logo">
                            <p><FontAwesomeIcon icon={faCar} className="icon"/> Registry Total</p>
                        </div>   
                        <div className="head">
                            <h1>Sign In</h1>
                        </div>
                        <div className="input">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="username"
                                name="username"
                                className="infor"
                                placeholder="Enter your username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="infor"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="forgot-account">
                            <a href ="/forgot">Forgot your password?</a>
                        </div>
                        <button className="press" type="submit" onClick={handleLogin} disabled={isLoading || isError || isMissing}>Sign In</button>
                        {/* <div className="account">Don’t have an account yet? {' '} 
                            <Link to="/signup" className="signup">Sign Up</Link>
                        </div> */}
                    </form> 
                </div>
            </div>
        </div>
        </>
    );
}