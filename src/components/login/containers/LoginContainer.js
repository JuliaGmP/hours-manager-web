import React, { useState } from "react";
import LoginComponent from "../components/LoginComponent";

const LoginContainer = (props) => {
    const [loading, setLoading] = useState(false);

    const submit = async ({email, password}) => {
        setLoading(true)
        try{
            //code
        }
        catch(e){
            console.log('error', e);
        }
        setLoading(false)
    };

    return <LoginComponent {...props} loading={loading} submit={submit} />;
};


export default LoginContainer;
