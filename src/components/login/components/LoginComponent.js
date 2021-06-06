import React, { useState, useEffect } from "react";
import "./LoginComponent.scss";

const LoginComponent = (props) => {
    const {loading, submit} = props;

    return (
        <div className="loginComponent">
            <div className="loginContainer">
                <div>Login</div>
            </div>
        </div>
    );
};
export default LoginComponent;
