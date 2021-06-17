import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import moment from 'moment';

const DatepickerRange =  (props) => {
    const { startDate, setStartDate, endDate, setEndDate } = props;
    return (
      <div className="formik-input-component" style={{flexDirection:"row"}}>
        <div>
        Fecha Inicial
        <div className="input-date-picker-container year">
            <img className="date-picker-icon" src={require("../../../assets/calendar.png")} alt="" />
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              locale="es"
              maxDate={moment(endDate).subtract("days", 1).toDate()}
              className="date-picker year"
              popperPlacement="top-end"
              dateFormat="d/MM/Y"
              calendarClassName="rasta-stripes"
            />
        </div>
        </div>
        <div>
        Fecha final
        <div className="input-date-picker-container year">
            <img className="date-picker-icon" src={require("../../../assets/calendar.png")} alt="" />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={moment(startDate).add("days", 1).toDate()}
              locale="es"
              className="date-picker year"
              popperPlacement="top-end"
              dateFormat="d/MM/Y"
              calendarClassName="rasta-stripes"
            />
        </div>
        </div>
      </div>
    );
};

export default DatepickerRange;
