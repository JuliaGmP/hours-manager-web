import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";

import "./CreateUserComponent.scss";

import FormikField from "../../../common/FormikField/FormikField";
import Grid from "@material-ui/core/Grid";
import { Formik } from "formik";
import * as Yup from "yup";

const CreateUserComponent = (props) =>{
    const {submit,  roles, loading, createUserPageVisible, setCreateUserPageVisible, userToEdit, setUserToEdit, userRole} = props;

    const initialValues = {
        name:  userToEdit && userToEdit.name ? userToEdit.name : "",
        password: "",
        email: userToEdit && userToEdit.email ? userToEdit.email : "",
        rol: userToEdit && userToEdit.rolesID ? userRole : "",
        schedule: userToEdit && userToEdit.calendar ? userToEdit.calendar : "",
        userCalendar: "",
    };

    const schema = Yup.object({
        name: Yup.string().required("Obligatorio"),
        password: Yup.string().min(8, 'Password must have at least 8 characters'),
        email: Yup.string().required("Obligatorio").email("Introduce un correo electrónico válido."),
        rol: Yup.string().required("Obligatorio"),
        schedule: Yup.array().required("Obligatorio"),
        //userCalendar: Yup.object().required("Obligatorio"),
    })



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
                <PageLayout title={"Crear usuario"} onCreate={createUserPageVisible} addButton onPress={()=>{setCreateUserPageVisible(!createUserPageVisible)}} formik={formik} loading={loading}>
                    <div className="CreateUsersComponent">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={8}>

                                    <Grid item xs={6}>
                                        <FormikField label="Nombre" name="name" type="text" formik={formik} placeholder={"Nombre"}/>
                                    </Grid>
                                    
                                    {!userToEdit && <Grid item xs={6}>
                                        <FormikField label="Password" name="password" type="password" formik={formik} placeholder={"Password"}/>
                                    </Grid>}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        <FormikField label="Email" name="email" type="text" formik={formik} placeholder={"Email"}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormikField label="Rol" name="rol" type="selector" selectorItems={roles} formik={formik} placeholder={"Rol"}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        <FormikField label="Horario" name="schedule" type="schedule" formik={formik} placeholder={"schedule"}/>
                                    </Grid>
                                    {/*<Grid item xs={6}>
                                        <FormikField label="Calendario" name="userCalendar" type="userCalendar" formik={formik} placeholder={"userCalendar"}/>
                                    </Grid>*/}
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

export default CreateUserComponent;
