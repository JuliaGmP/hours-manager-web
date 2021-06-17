import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";

import "./CreateClientComponent.scss";

import FormikField from "../../../common/FormikField/FormikField";
import Grid from "@material-ui/core/Grid";
import { Formik } from "formik";
import * as Yup from "yup";

const CreateClientComponent = (props) =>{
    const {loading, submit, user, createClientPageVisible,setCreateClientPageVisible, clientToEdit} = props;

    const initialValues = {
        name: clientToEdit ? clientToEdit.name : "",
        web: clientToEdit ? clientToEdit.web : "",
        email: clientToEdit ? clientToEdit.email : "",
        phone: clientToEdit ? clientToEdit.phone : "",
    };

    const schema = Yup.object({
        name: Yup.string().required("Obligatorio"),
        web: Yup.string(),
        email: Yup.string().email("Introduce un correo electrónico válido."),
        phone: Yup.number().typeError("Debe ser un número")
        
    });
    
    return (
        <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values) => {
            submit(values)
        }}>
        {(formik) => {
            return (
            <PageLayout title={"Crear cliente"} onCreate={createClientPageVisible} addButton onPress={()=>{setCreateClientPageVisible(!createClientPageVisible)}} formik={formik} loading={loading}>
                <div className="CreateClientsComponent">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField label="Nombre" name="name" type="text" formik={formik} placeholder={"Nombre"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormikField label="Web de referencia" name="web" type="text" formik={formik} placeholder={"Web de referencia"}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField label="Email de referencia" name="email" type="text" formik={formik} placeholder={"Email de referencia"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormikField label="Teléfono de referencia" name="phone" type="text"  formik={formik} placeholder={"Teléfono de referencia"}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </PageLayout>
            )}
        }
        </Formik>
    )
}

export default CreateClientComponent;
