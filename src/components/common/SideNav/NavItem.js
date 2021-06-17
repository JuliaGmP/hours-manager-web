import React from "react";
import "./sidenav.scss";
import { Link } from "react-router-dom";

const NavItemComponent = (props) => {
    const { name, icon, route, pathname } = props;
    const currentPath = pathname && "/" + pathname.split("/")[1];
    return (
        <Link to={route} className={`nav-item ${currentPath === route ? "active" : null}`}>
            <img src={icon} alt="" />
            {name}
        </Link>
    );
};
export default NavItemComponent;
