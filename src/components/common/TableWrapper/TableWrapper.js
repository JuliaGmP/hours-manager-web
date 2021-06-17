import React from "react";
import "./tablewrapper.scss";

const TableComponent = (props) => {
    const { headers, children, centerHeader } = props;
    return (
        <div className="table-wrapper">
            <table className="table-component">
            <tbody>
                <tr>
                    {headers.map((header,i) => (
                        <th className={`header ${centerHeader && "center"}`} key={i}>{header}</th>
                    ))}
                </tr>
                {children}
            </tbody>
            </table>
            
        </div>
    );
};
export default TableComponent;
