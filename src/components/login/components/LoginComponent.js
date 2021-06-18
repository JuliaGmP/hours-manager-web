import React, { useState, useEffect } from "react";
import Button from "../../common/Button/Button";
import "./LoginComponent.scss";
import Input from "../../common/Input/input";
import {getAllTenants} from "../../../services/tenants"
import FormikField from "../../common/FormikField/FormikField";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginComponent = (props) => {
    const {loading, submit} = props;
 
    const initialValues = {
        email: "",
        password: "",
    };

    const schema = Yup.object({
        email: Yup.string().required("Obligatorio").email("Introduce un correo electrónico válido."),
        password: Yup.string().required("Obligatorio")
    });

    return (
        <div className="loginComponent">
            <div style={{ width:"100%",  alignItems:"center", display:"flex", flexDirection:"column"}}>

            <div className="titleContainer">
                <div className="titleBold">HOURS MANAGER </div>
            </div>
                <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={(values) => {
                    submit(values)
                }}
                >
                {(formik) => {
                    return(
                        <div className="container">
                            <div className="title">Iniciar sesión</div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 150, marginBottom: 40 }}>
                                <FormikField loginStyle name="email" type="text" formik={formik} placeholder={"Email"}/>
                                <FormikField loginStyle passwordType name="password" type="text" formik={formik} placeholder={"Contraseña"}/>
                            </div>
                            {props.error ? <div className="error">{props.error}</div> : null}
                            <Button
                                text="Iniciar sesión"
                                style={{backgroundColor: "#86b34f"}}
                                onPress={() => {
                                    formik.handleSubmit();
                                }}
                                loading={loading}
                            />
                        </div>
                    ) 
                    }}
                </Formik>
                
            </div>
        </div>
    );
};
export default LoginComponent;
