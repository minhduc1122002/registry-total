import React from 'react'
import './Table.scss'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CenterTable( { cols, rows, title, row_id, actionColumn }) {
    const user = useSelector((state) => state.auth.user);
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Table
                {user.role === 'department' &&
                <div style={{display: 'flex'}}>
                    <Link to="/center/form" className="link primary-btn">
                    Thêm
                    </Link>
                </div>
                }
            </div>
            <DataGrid
                className="datagrid"
                rows={rows}
                columns={cols.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row[row_id]}
                slots={{toolbar: GridToolbar}}
            />
        </div>
    );
}