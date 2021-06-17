import React, { useState, useEffect } from "react";
import PageLayout from "../../../layouts/PageLayout/PageLayout";
import "./HomeComponent.scss";
import TableWrapper from "../../common/TableWrapper/TableWrapper";
import Button from "../../common/Button/Button"
import FormikField from "../../common/FormikField/FormikField";
import ModalLayout from "../../../layouts/ModalLayout/ModalLayout"

// services
import { getHoursInAWeek, addHours, deleteHours } from "../../../services/hours";
import {formatHour,getTotalHours,getWeeks,getWeekFormatted,dateEqual,getTotalHoursInADay, contertToHourTime, formatHourHourMinutes} from "../../../services/utils";
import { getUserCalendar } from "../../../services/users";
import {getClients} from "../../../services/clients"
import {getProjects, getUserProjects} from "../../../services/projects"
import {getUsers} from "../../../services/users"

import Grid from "@material-ui/core/Grid";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import moment from 'moment';
import Lottie from 'react-lottie';
import animationData from '../../../assets/lottie/loading.json'

const HomeComponent = (props) => {
    const {token, isAdmin, userId, userCalendarID} = props;
    const [weekSelected, setWeekSelected] = useState(new Date());
    const [weeks, setWeeks] = useState();

    useEffect(() => {
        getDataWeeks()
    }, []);

    const getDataWeeks = () =>{
        setWeeks(getWeeks())
    }

    return (
        <PageLayout title={getWeekFormatted(weekSelected)} isAdmin={isAdmin}>  
            <div className="HomeComponent">
                <div className="hours-container">
                    <div className="text" style={{marginBottom: 20}}>Horas registradas</div>
                   <HoursList isAdmin={isAdmin} token={token} weekSelected={weekSelected} userId={userId} userCalendarID={userCalendarID} weeks={weeks}/>
                </div>
                {
                isAdmin &&  
                <div className="calendar-container">
                    <CalendarList text="Calendario" weekSelected={weekSelected} setWeekSelected={setWeekSelected} weeks={weeks}/>
                </div> 
                }
            </div>   
        </PageLayout>
    );
};
export default HomeComponent;


const CalendarList = (props) =>{
    const {text, weekSelected, setWeekSelected, weeks} = props;
    const [showData, setShowData] = useState(true);

    return(
        <div>
            <div className="listItemTitleCalendar"  onClick={()=>{setShowData(!showData)}}>
                <img className="arrowIcon" src={showData ? require("../../../assets/arrowDown.svg") : require("../../../assets/arrowUp.svg")} alt="" />
                <div className="text" style={{fontSize:20}}>{text}</div>
            </div>
            {showData && weeks && weeks.length > 0
                ? weeks.map( (item, i) => 
                   (
                    <div key={i} className={getWeekFormatted(weekSelected) === getWeekFormatted(item) ? "weekItemSelected" : "weekItem"} 
                    onClick={()=>{ setWeekSelected(item)}}>
                        <div className={getWeekFormatted(weekSelected) === getWeekFormatted(item) ? "textSelected" : "text"}>
                            {getWeekFormatted(item)}
                        </div>
                    </div>
                  ))
                : null
            }        
        </div>)

}

const HoursList = (props) =>{
    const {isAdmin ,token, weekSelected, userId, weeks, userCalendarID} = props;
    const [data, setData] = useState(false);
    const [loadingHours, setLoadingHours] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [showUserProjects, setShowUserProjects] = useState(false);
    const [hoursToEdit, setHoursToEdit] = useState();
    const [submitEditingHours, setSubmitEditingHours] = useState(false);
    const [dateSelected, setDateSelected] = useState(undefined);
    const [userIdSelected, setUserIdSelected] = useState(undefined);

    // Admin Set Data
    useEffect(() => {
        if(isAdmin){
            setShowUserProjects(false)
            getAllUser()
        }
    }, [weekSelected]);

    // User Set Data
    useEffect(() => {
        if(!isAdmin){
            getUserHours()
        }
    }, [weeks]);

    useEffect(() => {
        if(!showUserProjects) {
            setDateSelected(undefined)
            setUserIdSelected(undefined)
        }
     }, [showUserProjects]);

     useEffect(() => {
        if(submitEditingHours) {
            setSubmitEditingHours(false)
            if (isAdmin) {

                // UPDATE HOURS
                if(hoursToEdit[0] === undefined){
                    getAllUser()
                }else{
                    const user = _.find(data, {id: hoursToEdit[0].userId})
                    const day = moment(hoursToEdit[0].date).day() - 1;
                    user.hours[day] = hoursToEdit;
                    // Find item index using _.findIndex 
                    var index = _.findIndex(data, {id: user.id})
                    // Replace item at index using native splice
                    data.splice(index, 1, user);
                    setData(data)

                    //getAllUser()
                }
            }
            else {
                getUserHours()
            }
        }
     }, [submitEditingHours]);

    const getAllUser = async () =>{
        try{
            setLoadingHours(true)
            const response = await getUsers(token);
            console.log(response)
            if(response.error) throw new Error('Error');
            for(const item of response) {
                item.week = weekSelected
                const hours = await getHoursInAWeekContainer(weekSelected, item.id)
                const calendar = await getUserCalendarContainer(item.userCalendarID)
                item.calendar = calendar.schedule
                item.hours= hours;
            }
            setData(response)
            setLoadingHours(false)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    const getUserHours = async () =>{
        try{
            setLoadingHours(true)
            const userData = []
            for(const week of weeks) {
                let userWeekData = {}
                userWeekData.week = week;
                const hours = await getHoursInAWeekContainer(week, userId)
                const calendar = await getUserCalendarContainer(userCalendarID)
                userWeekData.hours= hours;
                userWeekData.calendar = calendar.schedule
                userData.push(userWeekData)
            }
            setData(userData)
            setLoadingHours(false)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    const getHoursInAWeekContainer = async (date, userId) => {
        const response = await getHoursInAWeek(token, date, userId);
        if(!response.error) return response;
    }

    const getUserCalendarContainer = async (userCalendarID) => {
        const response = await getUserCalendar(token, userCalendarID);
        if(!response.error) return response;
    }

    const handleEditHours = (item, week, dayNumber) =>{
        const day = moment(week).weekday()
        setDateSelected(moment(week).subtract(day-dayNumber, "days"))
        setUserIdSelected(item.id)
        setLoadingProjects(true)
        setHoursToEdit(item.hours[dayNumber])
        setShowUserProjects(true)
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };

    return(
        <div>
            <div style={{paddingRight:20, paddingLeft:20, display:"flex", flexDirection: "row", height: "100%"}}>
               <TableWrapper centerHeader={true} headers={[isAdmin ? "Nombre" : "Semana" , "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SEMANAL"]}>
               {data && data.length > 0 && !loadingHours
                       ? data.map( (item, i) => {
                           const totalHoursObject = getTotalHours(item)
                           return(
                               <tr key={i} style={{height:70}}>
                                   <td className="element">{isAdmin ?  item.name : getWeekFormatted(item.week)}</td>
                                   <TableItem dayNumber={0} item={item} handleEditHours={handleEditHours} dateSelected={dateSelected} userIdSelected={userIdSelected}/>
                                   <TableItem dayNumber={1} item={item} handleEditHours={handleEditHours} dateSelected={dateSelected} userIdSelected={userIdSelected}/>
                                   <TableItem dayNumber={2} item={item} handleEditHours={handleEditHours} dateSelected={dateSelected} userIdSelected={userIdSelected}/>
                                   <TableItem dayNumber={3} item={item} handleEditHours={handleEditHours} dateSelected={dateSelected} userIdSelected={userIdSelected}/>
                                   <TableItem dayNumber={4} item={item} handleEditHours={handleEditHours} dateSelected={dateSelected} userIdSelected={userIdSelected}/>
                                   <td className="element-user-hours" style={{color: totalHoursObject.totalHours < totalHoursObject.scheduleHours ? "red" : "#292f36"}}>
                                       {formatHour(totalHoursObject.totalHours)}
                                   </td>
                               </tr>
                         )})
                       : null}
               </TableWrapper>
               {showUserProjects && 
               <ModalLayout show={showUserProjects}>
                   { isAdmin ?
                    <UserProjectsList date={dateSelected} weekSelected={weekSelected} loadingProjects={loadingProjects} setLoadingProjects={setLoadingProjects} hoursToEdit={hoursToEdit} setHoursToEdit={setHoursToEdit} setSubmitEditingHours={setSubmitEditingHours} userId={userIdSelected} token={token} setShowUserProjects={setShowUserProjects}/>
                    :
                    <UserProjectsList date={dateSelected} loadingProjects={loadingProjects} setLoadingProjects={setLoadingProjects} hoursToEdit={hoursToEdit} setHoursToEdit={setHoursToEdit} setSubmitEditingHours={setSubmitEditingHours} userId={userId} token={token} setShowUserProjects={setShowUserProjects}/>
                   }
                </ModalLayout>
               }
            </div>   
            {loadingHours ?
                <div className="loading">
                    <Lottie options={lottieDefaultOptions}
                            height={100}
                            width={100}
                    /> 
                </div> 
                : 
                data.length === 0 && <div className="loading">Sin datos</div>
            }
        </div>
    )
}

const TableItem = (props) =>{
    const {dayNumber, item, handleEditHours, dateSelected, userIdSelected} = props;
    const [showEditIcon, setShowEditIcon] = useState(false);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if(dateSelected === undefined) {
            setSelected(false)
        } else {
            isItemSelected()
        }
    }, [dateSelected]);

    const isItemSelected = () =>{
        const day = moment(item.week).day(dayNumber+1)
        if(item.id !== undefined)
            setSelected(moment(day).isSame(dateSelected, 'day') && (item.id === userIdSelected))
        else 
            setSelected(moment(day).isSame(dateSelected, 'day'))
    }

    const getHoursIcon = (dayNumber, week) =>{
        const today = new Date()
        if(dateEqual(today,week)){
            if(today.getDay() -1 > dayNumber) return require("../../../assets/warning.png")
            if(today.getDay() -1 === dayNumber) return require("../../../assets/add.png")
            else return require("../../../assets/noHours.png")
        } else {
            return require("../../../assets/warning.png")
        }
    }

    const isClickable = () =>{
        const today = new Date()
        if(dateEqual(today, item.week)){
            if(today.getDay() > dayNumber) return true
            else return false
        } else {
            return true
        }
    }

    return(
        <td className="element-user-hours" onClick={()=>{
            if (isClickable()) {
                handleEditHours(item, item.week, dayNumber)
            }}}>
            {
            item.hours[dayNumber].length !== 0 ? 
                <div className={`hours-item ${isClickable() && "clickable"} ${selected && "selected"}`} onMouseEnter={()=>setShowEditIcon(true)} onMouseLeave={()=>setShowEditIcon(false)}>
                    {formatHour(getTotalHoursInADay(item.hours[dayNumber]))}
                    {(showEditIcon || selected) && <img className="edit-icon" src={require("../../../assets/editPencilIcon.png")} alt="" />}
                </div> 
            : 
            <div className={`hours-item ${isClickable() && "clickable"} ${selected && "selected"}`} onMouseEnter={()=>setShowEditIcon(true)} onMouseLeave={()=>setShowEditIcon(false)}>
                <img className="hoursIcon"  src={getHoursIcon(dayNumber, item.week)} alt="" />
            </div>
            }
        </td>
    )
}

const UserProjectsList = (props) =>{
    const {date, token, hoursToEdit, userId, setHoursToEdit, loadingProjects, setLoadingProjects, setSubmitEditingHours, setShowUserProjects} = props;
    const [projects, setProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [indexProjectSelected, setIndexProjectSelected] = useState(0);
    const [showEditHours, setShowEditHours] = useState(false);

    useEffect(() => {
        setShowEditHours(false)
    }, [hoursToEdit]);

    useEffect(() => {
        if(loadingProjects)getAllProjects();
    }, [loadingProjects]);

    const getAllProjects = async () => {
        try{
            setProjects([])
            const responseUserProjects = await getUserProjects(userId, token);
            const responseClients = await getClients(token);
            if(responseClients.error) throw new Error('Error');
            const responseProjects = await getProjects(responseClients, token);
            setUserProjects(responseUserProjects)
            setProjects(responseProjects)
            setLoadingProjects(false)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    const handleEditProject = (index, idProject) =>{
        // check if the user is still part of the project selected to edit 
        if( userProjects.find(project => project.id === idProject)){
            setShowEditHours(true)
            setIndexProjectSelected(index)
        } else {

        }
    }

    const handleDeleteProjectHours = async (hourID) =>{
        const response = await deleteHours(hourID, token) 
        if(response.status === 204) setHoursToEdit(hoursToEdit.filter((hour)=> hour.id !== hourID))
        setSubmitEditingHours(true)
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };

    return (
        
        <div className="edit-hours">
            <div className="edit-hours-title">
                <div >{hoursToEdit.length !== 0 ? "Editar tiempo" : "Añadir tiempo"}</div>
                <img className="close-icon" onClick={()=>setShowUserProjects(false)} src={require("../../../assets/closeX.png")} alt="" />
            </div>
            {!showEditHours ?
                <div> 
                    {projects && projects.length !== 0 && !loadingProjects && hoursToEdit.length !== 0 ? hoursToEdit.map((hour, index) => {
                    return (
                        <div className="projects-list" key={index}>
                            <div className="project-name">{_.find(projects, {id: hour.idProject }).name}</div>
                            <div>{formatHour(hour.number_hours)}</div>
                            <img className="project-icon" onClick={()=>handleEditProject(index, hour.idProject)} src={require("../../../assets/editPencilIcon.png")} alt="" />
                            <img className="project-icon" onClick={()=>handleDeleteProjectHours(hour.id)} src={require("../../../assets/bin.png")} alt="" />
                        </div>
                        )
                    })
                    :   loadingProjects ?
                            <Lottie options={lottieDefaultOptions}
                                height={50}
                                width={50}
                            /> 
                            : null
                    }
                    <div className="projects-list">
                        <div className="project-name">Agregar Proyectos</div>
                        <img className="project-icon" onClick={()=> {setIndexProjectSelected(null); setShowEditHours(true)}} src={require("../../../assets/add.png")} alt="" />
                    </div>  
                </div> 
                : 
                <UserAddHoursForm date={date} projects={userProjects} indexProjectSelected={indexProjectSelected} hoursToEdit={hoursToEdit} setHoursToEdit={setHoursToEdit} userId={userId} token={token} setShowEditHours={setShowEditHours} setSubmitEditingHours={setSubmitEditingHours}/>
            }
        </div> 

    )

}

const UserAddHoursForm = (props) =>{
    const {token, date, projects, hoursToEdit, setHoursToEdit, userId, setShowEditHours, indexProjectSelected, setSubmitEditingHours} = props;
    const matches = useMediaQuery('(min-width:1500px)');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSubmitEditingHours(false)
    }, []);

    const initialValues = {
        project: hoursToEdit.length !== 0 && projects && projects[indexProjectSelected] ? _.find(projects, {id: hoursToEdit[indexProjectSelected].idProject }) : "",
        hours: hoursToEdit.length !== 0 && projects[indexProjectSelected] ? formatHourHourMinutes(hoursToEdit[indexProjectSelected].number_hours) : 0,
        date: hoursToEdit.length !== 0 && projects[indexProjectSelected] ? hoursToEdit[indexProjectSelected].date : date,
    };
    console.log(initialValues)

    const schema = Yup.object({
        project: Yup.object().required("Obligatorio"),
        hours: Yup.string().required("Obligatorio").matches(/^([0-1]?[0-9]|2[0-3])h( [0-5]?[0-9]m)?$/, 'Ej. 1h 30m'),
        date: Yup.date().required("Obligatorio"),
    });

    const submit = async ({ project, hours, date}) => {
        setLoading(true)
        hours = contertToHourTime(hours);

        try {
            const response = await addHours(userId, date, hours, project.id, token)
            if(response.error) throw new Error()
            if(hoursToEdit.length !== 0){
                if(_.unionBy([response], hoursToEdit, 'idProject')) setHoursToEdit(_.unionBy([response], hoursToEdit, 'idProject'))
                else setHoursToEdit(hoursToEdit.push(response))
            } else {
                setHoursToEdit([response])
            }
            setSubmitEditingHours(true)
            setShowEditHours(false)
        } catch (error) {
            console.log(error);
        } 
        setLoading(false)

    }

    const backToProjectList = () =>{
        setShowEditHours(false)
    }

    return(
        projects && projects.length !== 0 ?
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
            <div>
                <Grid container >
                    <Grid item xs={12}>
                        <FormikField type="projectsSelector" editHoursForm={hoursToEdit} selectorItems={projects} label="" name="project" formik={formik} placeholder={"Proyecto"}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={matches ? 7 : 0} direction={matches? "row" : "column"}>
                            <Grid item xs={matches ? 5 : 12}>
                                <FormikField label="Tiempo" name="hours" editHoursForm type="hourText" formik={formik} placeholder={"Horas"}/>
                            </Grid>
                            <Grid item xs={matches ? 7 : 12}>
                                <FormikField label="Fecha" name="date" editHoursForm type="date" formik={formik} placeholder={"Fecha"}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div className="button-wrapper">
                    <Button className="cancel button" text="CANCELAR" onPress={()=>backToProjectList()}/>
                    <Button loading={loading} className="button" text="GUARDAR" onPress={formik.handleSubmit}/>
                </div>
            </div>
            )}
        }
        </Formik>
        :
        <div>No hay proyectos para este usuario.</div>


    )
}
