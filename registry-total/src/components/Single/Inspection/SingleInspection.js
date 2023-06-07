import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
import Export from "./Print";

export default function SingleInspection( { inspection }) {

    // const actionColumn = [
    //     {
    //         field: "action",
    //         width: 150,
    //         renderCell: (params) => {
    //             return (
    //                 <div className="cellAction">
    //                     <Link to={`/inspections/print/${params.row.register_id}`} style={{ textDecoration: "none" }}>
    //                         <div className="exportButton">Export</div>
    //                     </Link>
    //                     <div
    //                         className="editButton"
    //                     >
    //                     Edit
    //                     </div>
    //                 </div>
    //             );
    //         },
    //     },
    // ];

    return (
    <>
    <div className="dashboard-layout">
        <h4 className="dashboard-title">Inspection</h4>
        <div className="statistics-line-chart">
        <div className="content">
                <h2 className="form-header">Giấy đăng kiểm</h2>
                <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                    {/* <Button primary={true} onClick={actionColumn}>
                    </Button> */}
                    <div className="cellAction">
                        <Link to={`/inspection/print/0000`} style={{ textDecoration: "none" }}>
                            <div className="exportButton">Export</div>
                            {/* <Export /> */}
                        </Link>
                        <Link to={`/inspection/edit/0000`} style={{ textDecoration: "none" }}>
                            <div className="editButton">Edit</div>
                            {/* <Export /> */}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}