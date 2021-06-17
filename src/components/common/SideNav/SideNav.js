import React from "react";
import NavItem from "./NavItem";
import "./sidenav.scss";

const SideNavComponent = (props) => {
    const {isAdmin} = props;
    return (
        <div className="sidenav-component">
            {isAdmin ? menuItems.map((item, i) => {
                return <NavItem key={i} {...item} {...props}/>
            }) :  
            <NavItem {...menuItems[0]} {...props}/>}

        </div>
    );
};

const menuItems = [
    {
        name: "Home",
        icon: require("../../../assets/home.svg"),
        route: "/home"
    },
    {
        name: "Usuarios",
        icon: require("../../../assets/user.svg"),
        route: "/usuarios"
    },
    {
        name: "Clientes",
        icon: require("../../../assets/clients.svg"),
        route: "/clientes"
    },
    {
        name: "Proyectos",
        icon: require("../../../assets/projects.svg"),
        route: "/proyectos"
    }
];

export default SideNavComponent;
