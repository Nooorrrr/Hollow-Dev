import React from "react";

const Login = (props) => {
    return (
        <div className="login-container">
            <button className="hp-button" onClick = {props.connectWallet}>Login through Metamask</button>
        </div>
    )
}

export default Login;