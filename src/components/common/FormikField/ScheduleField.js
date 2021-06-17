import TableWrapper from "../TableWrapper/TableWrapper"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css'
import React, { useState, useEffect } from "react";
import {formatHourNumber, formatHour} from "../../../services/utils"

const ScheduleField = (props) => {

    const {onChange, value} = props;

    const [mondayVisible, setMondayVisible] = useState(false);
    const [tuesdayVisible, setTuesdayVisible] = useState(false);
    const [wednesdayVisible, setWednesdayVisible] = useState(false);
    const [thursdayVisible, setThursdayVisible] = useState(false);
    const [fridayVisible, setFridayVisible] = useState(false);
    const [addDayVisible, setAddDayVisible] = useState(false);

    const [mondayStartHour, setMondayStartHour] = useState(undefined);
    const [mondayEndHour, setMondayEndHour] = useState(undefined);
    const [mondayHours, setMondayHours] = useState("8:00");

    const [tuesdayStartHour, setTuesdayStartHour] = useState(undefined);
    const [tuesdayEndHour, setTuesdayEndHour] = useState(undefined);
    const [tuesdayHours, setTuesdayHours] = useState("8:00");

    const [wednesdayStartHour, setWednesdayStartHour] = useState(undefined);
    const [wednesdayEndHour, setWednesdayEndHour] = useState(undefined);
    const [wednesdayHours, setWednesdayHours] = useState("8:00");

    const [thursdayStartHour, setThursdayStartHour] = useState(undefined);
    const [thursdayEndHour, setThursdayEndHour] = useState(undefined);
    const [thursdayHours, setThursdayHours] = useState("8:00");

    const [fridayStartHour, setFridayStartHour] = useState(undefined);
    const [fridayEndHour, setFridayEndHour] = useState(undefined);
    const [fridayHours, setFridayHours] = useState("8:00");

    useEffect(() => {
        handleInitialValues(value)
    }, [value]);

    const handleInitialValues = (values) =>{
            for (const item of values){
                if(item.day === "Monday") {
                    setMondayHours(formatHour(item.hours)); 
                    setMondayVisible(true)
                }
                if(item.day === "Tuesday") {
                    setTuesdayHours(formatHour(item.hours)); 
                    setTuesdayVisible(true)
                }
                if(item.day === "Wednesday") {
                    setWednesdayHours(formatHour(item.hours)); 
                    setWednesdayVisible(true)
                }
                if(item.day === "Thursday") {
                    setThursdayHours(formatHour(item.hours)); 
                    setThursdayVisible(true)
                }
                if(item.day === "Friday") {
                    setFridayHours(formatHour(item.hours)); 
                    setFridayVisible(true)
                }
            }
    }

    useEffect(() => {
        setAddDayVisible(true)
        if(mondayVisible && tuesdayVisible && wednesdayVisible && thursdayVisible && fridayVisible)
            setAddDayVisible(false)
    }, [mondayVisible, tuesdayVisible, wednesdayVisible, thursdayVisible, fridayVisible]);

    useEffect(() => {
        const schedule=[]
        const mondayHoursNumber = formatHourNumber(mondayHours)
        const tuesdayHoursNumber = formatHourNumber(tuesdayHours)
        const wednesdayHoursNumber = formatHourNumber(wednesdayHours)
        const thursdayHoursNumber = formatHourNumber(thursdayHours)
        const fridayHoursNumber = formatHourNumber(fridayHours)

        if(mondayHoursNumber > 0 && mondayVisible){
            schedule.push({
                day:"Monday",
                hours:mondayHoursNumber
            }) 
        }
        if(tuesdayHoursNumber > 0 && tuesdayVisible){
            schedule.push({
                day:"Tuesday",
                hours:tuesdayHoursNumber
            }) 
        }
        if(wednesdayHoursNumber > 0 && wednesdayVisible){
            schedule.push({
                day:"Wednesday",
                hours:wednesdayHoursNumber
            }) 
        }
        if(thursdayHoursNumber > 0 && thursdayVisible){
            schedule.push({
                day:"Thursday",
                hours:thursdayHoursNumber
            }) 
        }
        if(fridayHoursNumber > 0 && fridayVisible){
            schedule.push({
                day:"Friday",
                hours:fridayHoursNumber
            }) 
        }
        onChange(schedule)
    }, [mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, mondayVisible, tuesdayVisible, wednesdayVisible, thursdayVisible, fridayVisible]);


    return(
        <div>
            <TableWrapper headers={["Día", "Horas totales",""]}> {/* "Hora de inicio", "Hora de finalización", "Horas totales",""]}>*/}
                {mondayVisible && 
                    <ScheduleItem 
                        day={"Lunes"}
                        dayVisible={mondayVisible}
                        setDayVisible={setMondayVisible}
                        startHour={mondayStartHour}
                        setStartHour ={setMondayStartHour}
                        endHour ={mondayEndHour}
                        setEndHour={setMondayEndHour}
                        hours={mondayHours}
                        setHours={setMondayHours}
                    />}
                {tuesdayVisible && 
                    <ScheduleItem 
                        day={"Martes"}
                        dayVisible={tuesdayVisible}
                        setDayVisible={setTuesdayVisible}
                        startHour={tuesdayStartHour}
                        setStartHour ={setTuesdayStartHour}
                        endHour ={tuesdayEndHour}
                        setEndHour={setTuesdayEndHour}
                        hours={tuesdayHours}
                        setHours={setTuesdayHours}
                    />}
                {wednesdayVisible && 
                    <ScheduleItem
                        day={"Miércoles"}
                        dayVisible={wednesdayVisible}
                        setDayVisible={setWednesdayVisible}
                        startHour={wednesdayStartHour}
                        setStartHour ={setWednesdayStartHour}
                        endHour ={wednesdayEndHour}
                        setEndHour={setWednesdayEndHour}
                        hours={wednesdayHours}
                        setHours={setWednesdayHours}
                    />}
                {thursdayVisible && 
                    <ScheduleItem 
                        day={"Jueves"}
                        dayVisible={thursdayVisible}
                        setDayVisible={setThursdayVisible}
                        startHour={thursdayStartHour}
                        setStartHour ={setThursdayStartHour}
                        endHour ={thursdayEndHour}
                        setEndHour={setThursdayEndHour}
                        hours={thursdayHours}
                        setHours={setThursdayHours}
                    />}
                {fridayVisible && 
                    <ScheduleItem 
                        day={"Viernes"}
                        dayVisible={fridayVisible}
                        setDayVisible={setFridayVisible}
                        startHour={fridayStartHour}
                        setStartHour ={setFridayStartHour}
                        endHour ={fridayEndHour}
                        setEndHour={setFridayEndHour}
                        hours={fridayHours}
                        setHours={setFridayHours}
                    />}
            </TableWrapper>
            {addDayVisible && 
                <div style={{paddingTop:10}}>
                <DropdownButton
                    as={ButtonGroup}
                    variant={'danger'}
                    title={"Añadir día"}
                >
                    {!mondayVisible && <Dropdown.Item onClick={()=>setMondayVisible(true)}>Lunes</Dropdown.Item>}
                    {!tuesdayVisible && <Dropdown.Item onClick={()=>setTuesdayVisible(true)}>Martes</Dropdown.Item>}
                    {!wednesdayVisible && <Dropdown.Item onClick={()=>setWednesdayVisible(true)}>Miércoles</Dropdown.Item>}
                    {!thursdayVisible && <Dropdown.Item onClick={()=>setThursdayVisible(true)}>Jueves</Dropdown.Item>}
                    {!fridayVisible && <Dropdown.Item onClick={()=>setFridayVisible(true)}>Viernes</Dropdown.Item>}
                </DropdownButton>
            </div>}
        </div>
    )
}

const ScheduleItem = (props) =>{

    const {day, dayVisible,  setDayVisible, startHour, setStartHour, endHour, setEndHour, hours, setHours, handleChanges} = props;
    const [error, setError] = useState(false);

    useEffect(() => {
        if(startHour !== undefined && endHour !== undefined)
            diffHours(startHour,endHour)
    }, [startHour,endHour]);

    const diffHours = (startHour,endHour) =>{
        setError(false)
        const diffHours = endHour.diff(startHour, 'hours')
        if(diffHours>0){
            let mins = moment.utc(moment(endHour, "HH:mm:ss").diff(moment(startHour, "HH:mm:ss"))).format("mm")          
            setHours(diffHours + ":" + mins)
            ;}
        else {
            setError(true)
            setHours("0:00")
            setTimeout(() => {setError(false)}, 5000)
        }
    }

    return(
        <tr>
            <td className="element-schedule">{day}</td>
            {/*
            <td className="element-add-hours"> 
                <TimePicker suffixIcon={<img className="arrowIcon" src={require("../../../assets/arrowDown.svg")} alt="" />} clearIcon="" inputReadOnly={true}
                    bordered={false} value={startHour} onSelect={(value)=>setStartHour(value)} format={"HH:mm"}/>
            </td>
            <td className="element-add-hours">
                <TimePicker suffixIcon={<img className="arrowIcon" src={require("../../../assets/arrowDown.svg")} alt="" />} clearIcon="" inputReadOnly={true}
                    bordered={false} value={endHour} onSelect={(value)=>setEndHour(value)} format={"HH:mm"}/>
            </td>
            
            <td className="element-schedule" style={{color: error && "red"}}>
                {hours}
            </td>
            */}
            <td className="element-add-hours">
                <TimePicker suffixIcon={<img className="arrowIcon" src={require("../../../assets/arrowDown.svg")} alt="" />} clearIcon="" defaultValue={moment('08:00', 'HH:mm')} inputReadOnly={true}
                    bordered={false} value={moment(hours, 'HH:mm')} onSelect={(value)=>setHours(moment(value).format('HH:mm'))} format={"HH:mm"}/>
            </td>
            <td className="element-schedule">                
                <img onClick={()=>{setDayVisible(!dayVisible)}} className="binIcon" src={require("../../../assets/bin.png")} alt="" />
            </td>
        </tr>
    )
}

export default ScheduleField;
