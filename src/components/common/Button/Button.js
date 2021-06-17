import React from "react";
import "./button.scss";
import Lottie from "react-lottie";
import animationData from "../../../assets/lottie/loading-white.json";

const ButtonComponent = (props) => {
    const { text, onPress, disabled, type, loading, className, useDiv, icon } = props;

    return (
        <button className={`button-component ${disabled && "disable"} ${className}`} onClick={(e) => onPress && onPress(e)} disabled={disabled || loading} type={type} style={props.style}>
            {loading ? (
                <div style={{ minWidth: 90, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lottie options={defaultOptions} height={50} width={50} />
                </div>
            ) : (
                <div style={{paddingRight:10, paddingLeft:10, alignItems:"center", display:"flex", justifyContent:"center"}}>
                    { icon && <img className="icon" src={require("../../../assets/" + icon)} alt="" />}
                    {text}
                </div>
            )}
        </button>
    );
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default ButtonComponent;
