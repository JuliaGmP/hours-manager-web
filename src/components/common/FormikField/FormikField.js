import React, { useState, useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import "react-quill/dist/quill.snow.css";
import Input from "../Input/input";
import "./formik.scss";
import ScheduleField from "./ScheduleField"
import UsersField from "./UsersField"
import TranchesField from "./TranchesField"
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import _ from "lodash";
import {formatHourNumber, formatHour, formatHourHourMinutes} from "../../../services/utils"
import colors from "../../../designSystem/colors.scss";

registerLocale('es', es)

const FormikFieldComponent = (props) => {
    const { label, name, type, formik, placeholder, editHoursForm, loginStyle, passwordType, enableEditDate, oneOption } = props;
    const hasError = formik.touched[name] && formik.errors[name];
    const selectorStyle = {
        control: () => ({
          display: "flex",
          fontSize: 14
        }),
        valueContainer: ()=> ({
            width: "100%",
            height: "100%",
            padding:0,
        }),
        option: (provided, state) => ({
            ...provided,
            color: "#292F36",
            fontSize: 14
        }),
        dropdownIndicator: () => ({
            padding: 0
          }),
        input: () => ({
            padding: 0,
            fontSize: 14
        }),
        
    }
    
    const getField = () => {
        if (type === "selector") {
            if(props.selectorItems){
            const options = props.selectorItems.map((item)=> {return { label: item.name || item.role, value: item }})
                return (
                    <Select 
                        styles={selectorStyle}
                        options={options} 
                        onChange={(option) => {
                            formik.setFieldValue(name, option.value)
                        }}
                        value={options && formik.values[name] !== undefined ? options.find(option => _.isEqual(option.value, formik.values[name])) : ''}
                    />
                );
            }
        }
        if (type === "projectsSelector") {
            const options = props.selectorItems.map((item)=> {return { label: item.name, value: item }})
            return (
                <Select 
                    styles={selectorStyle}
                    options={options} 
                    onChange={(option) => {
                        const hour = _.find(editHoursForm, {idProject : option.value.id})
                        formik.setFieldValue(name, option.value)
                        formik.setFieldValue("hours", hour ? formatHourHourMinutes(hour.number_hours) : 0)
                    }}
                    value={options && formik.values[name] !== undefined ? options.find(option => option.value.id === formik.values[name].id) : ''}
                />
            );
        }
        if (type === "schedule")
            return (
                <ScheduleField value={formik.values[name]} onChange={(value)=>formik.setFieldValue(name, value)}/>
            );
        if (type === "users")
            return (
                <UsersField label={label} oneOption={oneOption} value={formik.values[name]} onChange={(value)=>formik.setFieldValue(name, value)}/>
            );
        if (type === "tranches")
            return (
                <TranchesField value={formik.values[name]} onChange={(value)=>formik.setFieldValue(name, value)}/>
            );
        if (type === "hour")
            return (
                <TimePicker size="small" className="input-hour-container" suffixIcon={<img className="arrowIcon" src={require("../../../assets/arrowDown.svg")} alt="" />} clearIcon="" defaultValue={moment('09:00', 'HH:mm')} inputReadOnly={true}
                    bordered={false} value={moment(formatHour(formik.values[name]), 'HH:mm')} onSelect={(value)=>formik.setFieldValue(name, formatHourNumber(moment(value).format('HH:mm')))} format={"HH:mm"}/>
            );

        if (type === "hourText")
            return (
                <div>
                    <Field 
                        className="input-hourText-container"
                        name={name}
                        value={(formik.values[name])}
                        onBlur={
                            (value)=>{formik.setFieldValue(name, formatHourHourMinutes(value.target.value));}
                        } />
                </div>
            );
        if (type === "date")
        return (
            <div className="input-date-picker-container">
                <img className="date-picker-icon" src={require("../../../assets/calendar.png")} alt="" />
                <DatePicker
                    disabled={enableEditDate ? false : true}
                    locale="es"
                    className="date-picker"
                    popperPlacement="top-end"
                    dateFormat="eeee, d MMMM"
                    calendarClassName="rasta-stripes"
                    selected={new Date(formik.values[name])}
                    onChange={(value)=>formik.setFieldValue(name, value)}
                />
            </div>
        );
        if (type === "dateWithYear")
        return (
            <div className="input-date-picker-container year">
                <img className="date-picker-icon" src={require("../../../assets/calendar.png")} alt="" />
                <DatePicker
                    //minDate={new Date()}
                    disabled={enableEditDate ? false : true}
                    locale="es"
                    className="date-picker year"
                    popperPlacement="top-end"
                    dateFormat="d/MM/Y"
                    calendarClassName="rasta-stripes"
                    selected={new Date(formik.values[name])}
                    onChange={(value)=>formik.setFieldValue(name, value)}
                />
            </div>
        );
        if (type === "number")
            return (
                <Field className="input" name={name} type={type} onChange={e => {
                    e.preventDefault();
                    const { value } = e.target;
                    const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                    if (!value || regex.test(value.toString())) {
                        formik.setFieldValue(name, value);
                    }
                  }}/>
            );
        if (type === "boolean") {
            const options = [{ label: "Sí", value: true},{ label: "No", value: false }]
            return (
                <Select 
                    styles={selectorStyle}
                    options={options} 
                    onChange={(option) => {
                        formik.setFieldValue(name, option.value)
                    }}
                    value={options && formik.values[name] !== undefined ? options.find(option => option.value === formik.values[name]) : false}
                />
            );
        }
        return (
            <>
                <Field className="input" name={name} type={type} placeholder={placeholder}/>
            </>
        );
    };
    if(loginStyle){
        return (
            <div className={`${hasError && "error"}`}>
                <Input
                    placeHolder={placeholder}
                    passwordType={passwordType}
                    onChange={(value) => {
                        formik.setFieldValue(name, value);
                    }}/>
                <div className="error-message">
                    <ErrorMessage name={name} />
                </div>
            </div>
        );
    }
    return (
        <div className="formik-input-component">
            {type === "users" ? null : <div className="title-input">{label}</div>}
            {editHoursForm ?
                <div className={`input-edit-hours-form-container ${hasError && "error"}`} style={{background: type === "date" && "#F3F3F3"}}>{getField()}</div>
                :
                <div className={type === "schedule" || type === "users" || type === "tranches" ? `input-schedule-container ${hasError && "error"}` : `input-container ${hasError && "error"}`}>{getField()}</div>
            }
            <div className="error-message">
                <ErrorMessage name={name} />
            </div>
        </div>
    );
};
export default FormikFieldComponent;
