import React from 'react'
import './Table.scss'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function InspectionTable( { cols, rows, title, row_id, actionColumn, filter, setFilter }) {
    const user = useSelector((state) => state.auth.user);
    console.log(rows)
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Table
                
                <div style={{display: 'flex'}}>
                    <button className="filter-btn" aria-haspopup="true" aria-expanded="true" onClick={() => setFilter(!filter)}>
                        <span>Filter by</span>
                        <FontAwesomeIcon icon={faChevronDown} className="c-icon"/>
                    </button>
                    {user.role === 'center' && <Link to="/inspection/form" className="link primary-btn">
                        Thêm
                    </Link>
                    }
                
                </div>
                
                
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