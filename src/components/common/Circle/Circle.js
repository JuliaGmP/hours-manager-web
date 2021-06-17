import React, { useState, useEffect } from "react";

const Circle = (props) => {

    const getSize = () =>{
        if (props.customSize) return props.customSize
        if (props.small) return 15
        if (props.big) return 40
        else return 20
    }
    return (
        <div style={{width: getSize(), height:  getSize(), borderRadius:  getSize()/2 , backgroundColor:props.color, display:"flex",justifyContent:"center", alignItems:"center", textAlign:"center", fontWeight:"bold", color:"white"}}>
            {props.children}
        </div>
    )
}

export default Circle;
