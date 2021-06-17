import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";

import "./CreateProjectComponet.scss";

import FormikField from "../../../common/FormikField/FormikField";
import Grid from "@material-ui/core/Grid";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import moment from "moment";

const CreateProjectComponet = (props) =>{
    const {user, submit, clients, loading,  projectUsers, createProjectPageVisible, setCreateProjectPageVisible, projectToEdit, setProjectToEdit} = props;

    const initialValues = {
        name:  projectToEdit ? projectToEdit.name : "",
        client: projectToEdit && clients ? _.find(clients, {id: projectToEdit.idClient }) : "",
        estimatedHours: projectToEdit ? projectToEdit.estimatedHours : "",
        endDate: projectToEdit && projectToEdit.endDate ? projectToEdit.endDate : moment().add(1,'days'),
        initialDate: projectToEdit && projectToEdit.initialDate ? projectToEdit.initialDate : moment(),
        users: projectToEdit && projectToEdit.userIDs ? projectUsers : [],
    };

    const schema = Yup.object({
        name: Yup.string().required("Obligatorio"),
        client: Yup.object().required("Obligatorio"),
        estimatedHours: Yup.number().required("Obligatorio"),
        endDate: Yup.date().required("Obligatorio").min(Yup.ref("initialDate"), "La fecha final debe ser mayor que la inicial."),
        initialDate: Yup.date().required("Obligatorio"),
        users: Yup.array().required("Obligatorio"),
    });

    return (
        <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values) => {
            submit(values)
        }}
        >
        {(formik) => {
            return (
            <PageLayout title={"Crear proyecto"} onCreate={createProjectPageVisible} addButton onPress={()=>{setCreateProjectPageVisible(!createProjectPageVisible)}} formik={formik} loading={loading}>
                <div className="CreateProjectComponet">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField label="Nombre" name="name" type="text" formik={formik} placeholder={"Nombre"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormikField  label="Cliente asociado" type="selector" selectorItems={clients} name="client" formik={formik} placeholder={"Cliente asociado"}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField label="Horas estimadas" name="estimatedHours" type="number" formik={formik} placeholder={"Horas estimadas"}/>
                                </Grid>     
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField type="dateWithYear" enableEditDate label="Fecha Inicio de Proyecto" name="initialDate" formik={formik} placeholder={"Fecha Inicio de Proyecto"}/>
                                </Grid>  
                                <Grid item xs={6}>
                                    <FormikField type="dateWithYear" enableEditDate label="Fecha Fin de Proyecto" name="endDate" formik={formik} placeholder={"Fecha Fin de Proyecto"}/>
                                </Grid>    
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <FormikField label="Miembros equipo" name="users" type="users" formik={formik} />
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

export default CreateProjectComponet;
