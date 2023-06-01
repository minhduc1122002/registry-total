import React from "react";
import './Login.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div className="login-container">
            <div className="login">
                <div className="login-banner">
                    <div className="logo">
                        <p><FontAwesomeIcon icon={faCar} className="icon"/> Registry Total</p>
                    </div>
                    <div className="welcome">
                        <h1>Welcome to Registry Total</h1>
                        <p>Please sign in to continune</p>
                    </div>
                </div>
                <div className="login-form">
                    <form className="form">   
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
                        <button className="press" type="submit">Sign In</button>
                        {/* <div className="account">Don’t have an account yet? {' '} 
                            <Link to="/signup" className="signup">Sign Up</Link>
                        </div> */}
                    </form> 
                </div>
            </div>
        </div>
    );
}