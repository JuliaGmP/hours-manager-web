import React, { useState, useEffect } from "react";
import PageLayout from "../../../layouts/PageLayout/PageLayout";
import "./UserProfileComponent.scss";
import Circle from "../../common/Circle/Circle"
import Button from "../../common/Button/Button"
import ModalLayout from "../../../layouts/ModalLayout/ModalLayout"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const UserProfileComponent = (props) =>{
    const { user, submitChangePassword, submit, error, loading, setError, editProfile, setEditProfile } = props;
    const [userName, setUserName] = useState(user.name);
    const [userEmail, setUserEmail] = useState(user.email);
    const [userPassword, setUserPassword] = useState("******");

    useEffect(() => {
        setError(undefined)
    }, [userName, userEmail])

    return (
        <PageLayout title={`Mi perfil ${editProfile ? `| Editar mi perfil` : ""}`} subtitleButton={`${!editProfile ? `Editar mi perfil` : `Volver`}`} onPressSubtitleButton={() => setEditProfile(!editProfile)}>
            <div className="user-profile-component">

                <div className="user-profile-detail">
                    <div className="label">Información personal</div>
                    <Card text={"Nombre"} data={user.name} editProfile={editProfile} onChangeInput={setUserName} inputValue={userName} icon={require("../../../assets/userIcon.png")}/>
                    <div className="label">Cuenta</div>
                    <Card text={"Email"} data={user.email} editProfile={editProfile} onChangeInput={setUserEmail} inputValue={userEmail} icon={require("../../../assets/mailIcon.png")}/>
                    <Card text={"Contraseña"} data={"******"} submitChangePassword={submitChangePassword} editProfile={editProfile} onChangeInput={setUserPassword} inputValue={userPassword} icon={require("../../../assets/passwordIcon.png")}/>
                    {editProfile && 
                    <div className="button-wrapper"> 
                        <Button loading={loading} className="button" text="Guardar" onPress={()=>submit(userName,userEmail)}/>
                    </div>
                    }
                    { editProfile && error !== undefined && <div className="error">{error}</div>}
                </div>              
            </div> 
        </PageLayout>
    )
}

const Card = (props) =>{
    const { icon, text, data, editProfile, onChangeInput, inputValue, submitChangePassword } = props;
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return(
            editProfile ? 
                <div className="card-container no-shadow">
                    <div className="input-component">
                        <div className="input-label">{text}</div>   
                        {text === "Contraseña" ? 
                        <div className="input-container password">
                            <ChangePasswordModal submitChangePassword={submitChangePassword} showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}/>
                            {data}
                            <div className="password-button" onClick={()=>setShowPasswordModal(true)}>Cambiar</div>
                        </div>
                        :
                        <input className="input-container" value={inputValue} onChange={(value)=>{ onChangeInput(value.target.value)}}/>
                        }
                    </div>
                </div>
                :
                <div className="card-container">
                    <div className="card-label">
                        <img className="card-icon" src={icon} alt="" /> 
                        <div className="label">{text}</div>   
                    </div>
                    <div className="text-data">{data}</div>
                </div>
    )

}

const ChangePasswordModal = (props) =>{
    const { showPasswordModal, setShowPasswordModal, submitChangePassword } = props;
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(undefined);
    const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
    const [newPasswordShown, setNewPasswordShown] = useState(false);
    const [newPasswordConfirmShown, setNewPasswordConfirmShownn] = useState(false);

    const toggleCurrentPasswordVisiblity = () => {
        setCurrentPasswordShown(currentPasswordShown ? false : true);
    };

    const toggleNewPasswordVisiblity = () => {
        setNewPasswordShown(newPasswordShown ? false : true);
    };

    const toggleNewPasswordConfirmVisiblity = () => {
        setNewPasswordConfirmShownn(newPasswordConfirmShown ? false : true);
    };

    useEffect(() => {
        setError(undefined)
    }, [newPassword, newPasswordConfirm, currentPassword])

    const submit = async () =>{
        if(currentPassword === ""){
            setError("Debes introducir la contraseña actual.")
            return;
        }
        if(newPassword !== newPasswordConfirm){
            setError("Las contraseñas deben ser iguales")
            return;
        }
        if(newPassword.length < 8){
            setError("Las contraseñas debe tener más de 8 caracteres.")
            return;
        }
        setLoading(true)
        try{
            await submitChangePassword(currentPassword, newPassword)
            setShowPasswordModal(false)
        } catch (e){
            setError("Error al cambiar la contraseña.")
        }
        setLoading(false)
    }

    return(
        <ModalLayout show={showPasswordModal}>
            <div style={{padding: 25, width: 600}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: "1px solid #F7F7F7", paddingBottom:20}}>
                    <div className="input-label" style={{fontSize:20}}>{"Cambiar contraseña"}</div>   
                </div>
                <div className="input-component" style={{paddingTop: 20, paddingBottom: 20}}>
                    <div className="input-label">{"Contraseña actual"}</div> 
                    <div className="input-container">
                        <input type={currentPasswordShown ? "text" : "password"} autocomplete="new-password" className="input-container-password" value={currentPassword} onChange={(value)=>{ setCurrentPassword(value.target.value)}} />
                        <FontAwesomeIcon onClick={toggleCurrentPasswordVisiblity} icon={faEye} />
                    </div>  
                </div>
                <div className="input-component" style={{paddingTop: 20, paddingBottom: 20}}>
                    <div className="input-label">{"Contraseña nueva"}</div> 
                    <div className="input-container">
                        <input type={newPasswordShown ? "text" : "password"} autocomplete="new-password" className="input-container-password" value={newPassword} onChange={(value)=>{ setNewPassword(value.target.value)}} />
                        <FontAwesomeIcon onClick={toggleNewPasswordVisiblity} icon={faEye} />
                    </div>    
                </div>
                <div className="input-component" style={{paddingTop: 20, paddingBottom: 20}}>
                    <div className="input-label">{"Confirmar nueva contraseña"}</div>   
                    <div className="input-container">
                        <input type={newPasswordConfirmShown ? "text" : "password"} autocomplete="new-password" className="input-container-password" value={newPasswordConfirm} onChange={(value)=>{ setNewPasswordConfirm(value.target.value)}} />
                        <FontAwesomeIcon onClick={toggleNewPasswordConfirmVisiblity} icon={faEye} />
                    </div>   
                </div>
                <div className="button-wrapper"> 
                    <Button className="cancel button left-button" text="CANCELAR" onPress={()=> setShowPasswordModal(false)}/>
                    <Button loading={loading} className="button" text="GUARDAR" onPress={()=> submit()}/>
                </div>
                { error !== undefined && <div className="error">{error}</div>}
            </div>
        </ModalLayout>
    )

}

export default UserProfileComponent;
