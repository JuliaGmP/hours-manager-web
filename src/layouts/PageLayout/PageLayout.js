import React, {useState, useEffect} from "react";
import "./pagelayout.scss";
import Button from "../../components/common/Button/Button"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../redux/actions/userActions";
import { withRouter } from "react-router-dom";

const PageLayoutComponent = (props) => {
    const { children, loading, title, addButton, goBack, onPress, onCreate, formik, isAdmin,subtitleButton, onPressSubtitleButton} = props;

    return (
        <div className="page-layout">
            <div className="title-container">
                <div style={{display:"flex", alignItems:"center"}}>
                <div className="title-page">
                  <div className="title">{title}</div>
                  {subtitleButton && 
                  <div className="subtitle-button" onClick={()=>onPressSubtitleButton()}>
                    {subtitleButton}
                  </div>
                }
                </div>
    
                </div>
                {goBack && 
                <div className="button-wrapper">
                  <Button className="cancel button" text={"Volver"} onPress={()=>onPress()}/>
                </div>}
                {addButton && 
                <div className="button-wrapper">
                    {onCreate &&  <Button className="cancel button" text={"CANCELAR"} onPress={()=>onPress()}/>}
                    {onCreate &&  <Button type="submit" loading={loading} className="button" text={"GUARDAR"} onPress={()=>formik.handleSubmit()}/>}
                    {!onCreate && <Button className="button" text={"AÑADIR NUEVO"} onPress={()=>onPress()}/>}
                </div>}

            </div>


            {children}
        </div>
    );
};
  
const mapStateToProps = (store) => ({
  user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageLayoutComponent));

