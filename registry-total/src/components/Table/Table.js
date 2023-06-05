import React from 'react'
import './Table.scss'
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Table( { cols, rows, title, row_id }) {
    const [data, setData] = useState(rows);
    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const actionColumn = [
        {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            console.log(params.row)
            return (
            <div className="cellAction">
                <Link to={`/inspection/${params.row.id}`} style={{ textDecoration: "none" }}>
                    <div className="viewButton">View</div>
                </Link>
                <div
                    className="deleteButton"
                    onClick={() => handleDelete(params.row.id)}
                >
                Delete
                </div>
            </div>
            );
        },
        },
    ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Table
                <Link to="/users/new" className="link">
                Add New
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                columns={cols.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row[row_id]}
            />
        </div>
    );
}