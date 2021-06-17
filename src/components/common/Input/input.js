import React from "react";
import "./input.scss";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill'

const InputComponent = (props) => {
    const { text, onChange, selectedValue } = props;

    const getTypeOfInput = () => {
        if (props.selector)
            return(
                <select className="input" onChange={(value)=>{ onChange(value.target.value)}} >
                    <option value="" selected disabled hidden>{selectedValue}</option>
                    {props.selectorItems ? props.selectorItems.map((item)=>{
                        return(<option key={item} value={item}>{item}</option>)
                    }) : null}
                </select>
            )
        else
            return (
                <input placeHolder={props.placeHolder? props.placeHolder: ""} className="input"
                type={props.passwordType ? "password" : props.dateType ? "date" : null}
                onChange={(value)=>{ onChange(value.target.value)}}/>
                )
    }

    return (
        <div className="input-component">
            <div className="title-input">{text}</div>
            <div className="input-container">
                {props.icon ? <img alt="" className="icon"src={props.icon} /> : null}
                {getTypeOfInput()}
            </div>
        </div>)
};
export default InputComponent;
