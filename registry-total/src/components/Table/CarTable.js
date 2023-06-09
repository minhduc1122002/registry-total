import React from 'react'
import './Table.scss'
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  
  }));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
      color: 'inherit',
      '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '16ch',
          '&:focus': {
            width: '20ch',
          },
        },
      },
      fontSize: '13px'
}));

export default function CarTable( { cols, rows, title, row_id, actionColumn }) {
    const [id, setID] = useState('')
    
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Table
                <div style={{display: 'flex'}}>
                    <div className="search-bar" style={{marginRight: '16px'}}>
                        <Search>
                            <SearchIconWrapper>
                            <SearchIcon style={{fontSize: '16px'}}/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Nhập mã số"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e) => setID(e.target.value)}
                            />
                        </Search>
                    </div>
                    <Link to="/inspection/form" className="link primary-btn">
                    Thêm (Upload File)
                    </Link>
                </div>
            </div>
            <DataGrid
                className="datagrid"
                rows={rows.filter(row => row.register_id?.toString().includes(id.toString()))}
                columns={cols.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row[row_id]}
            />
        </div>
    );
}