import React, { useState, useEffect } from "react";
import TableWrapper from "../TableWrapper/TableWrapper"
import Button from "../Button/Button"
import Circle from "../Circle/Circle"
import ModalLayout from "../../../layouts/ModalLayout/ModalLayout"
import {getUsersByTenantID} from "../../../services/users"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FaCheck } from 'react-icons/fa';
import { getUserRole } from "../../../services/users";
import { toHex } from "../../../services/utils"
import Lottie from 'react-lottie';
import animationData from '../../../assets/lottie/loading.json'

const TranchesField = (props) => {

    const {onChange, value} = props;
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [totalTranches, setTotalTranches] = useState(0);
    const [formPart, setFormPart] = useState(0);
    const [currentTranche, setCurrentTranche] = useState(undefined);

    console.log(currentTranche)

    useEffect(() => {
        if( value !== null && value.tranches !== undefined  && value.currentTranche !== undefined) {
            setTotalTranches(value.tranches)
            setCurrentTranche(value.currentTranche)
        }
    }, [value]);

    useEffect(() => {
        //onChange({tranches : totalTranches, currentTranche: currentTranche})
        setError(false)
    }, [totalTranches, currentTranche])

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
    };

    const addTranche = (i) =>{
        if(i === currentTranche)
            setCurrentTranche(i - 1)
        else 
            setCurrentTranche(i)
    }

    const getTranches = (totalTranches) => {
        let tranches = []
        for (let i = 0; i < totalTranches; i++){
            tranches.push(
                <div className="checkbox-item" key={i}>
                    <div className={i <= currentTranche ? "checkbox checked" : "checkbox"} onClick={() => {addTranche(i)}}>
                        {
                            i <= currentTranche &&
                            <FaCheck />
                        }
                    </div>
                    <div className="item-name">{`Tramo ${i + 1} (${Math.round(((100/totalTranches) + Number.EPSILON) * 100) / 100}%)`}</div>
                </div>
            )
        }
        return tranches;
    }

    const submitFormPart1 = () =>{
        if(totalTranches > 0 ) {
            if(value !== null && value.tranches !== 0  && value.currentTranche !== undefined)
                setFormPart(1)
            else
                submitFormPart2()
        } else {
            setError(true)
        }
    }

    const submitFormPart2 = () =>{
        console.log({tranches : totalTranches, currentTranche: currentTranche + 1 > totalTranches ? totalTranches : currentTranche})
        onChange({
            tranches : Number.parseInt(totalTranches), 
            currentTranche: currentTranche !== undefined ? 
                Number.parseInt(currentTranche + 1) > Number.parseInt(totalTranches) ? Number.parseInt(totalTranches-1) : Number.parseInt(currentTranche)
                :
                undefined
        })
        setShowModal(false)
        setFormPart(0)
    }


    return(
        <div>
            <ModalLayout show={showModal}>
                    {formPart === 0 ? 
                    <div style={{padding: 25, width: 600, justifyContent:"space-between", display:"flex", flexDirection:"column"}}>
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: "1px solid #F7F7F7", paddingBottom:20}}>
                                <div className="title-input" style={{fontSize:20}}>{"Número de tramos"}</div>   
                            </div>
                            <div style={{paddingTop: 20, paddingBottom: 20, width:"100%"}}>
                                <div className="title-input" style={{paddingBottom: 20}}>{"Introduce el número de tramos que tendrá el pago del proyecto"}</div>   
                                <input type="number" className={`input-container ${error && `error`}`} value={totalTranches} onChange={(value)=>{ setTotalTranches(value.target.value)}} />
                            </div>
                        </div>
                        <div className="button-wrapper"> 
                            <Button className="cancel button left-button" text="CANCELAR" onPress={()=> {setShowModal(false)}}/>
                            <Button className="button" text="GUARDAR" onPress={()=> {submitFormPart1()}}/>
                        </div>
                    </div> :
                    <div style={{padding: 25, width: 600, justifyContent:"space-between", display:"flex", flexDirection:"column"}}>
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: "1px solid #F7F7F7", paddingBottom:20}}>
                                <div className="title-input" style={{fontSize:20}}>{"Tramos de pago"}</div>   
                            </div>
                            <div className="checkbox-items">
                                {getTranches(totalTranches).map( (item) => {
                                        return item
                                })}
                            </div>
                        </div>
                        <div className="button-wrapper"> 
                            <Button className="cancel button left-button" text="CANCELAR" onPress={()=> {setFormPart(0)}}/>
                            <Button className="button" text="GUARDAR" onPress={()=> {submitFormPart2()}}/>
                        </div>
                    </div>
                    }
            </ModalLayout>
            <div className={`input-container`} onClick={()=>setShowModal(true)}>
                {currentTranche !== undefined ? `${value.currentTranche + 1} / ${value.tranches}` : value.tranches}
            </div>
        </div>
    )
}

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});


export default withRouter(connect(mapStateToProps)(TranchesField));

