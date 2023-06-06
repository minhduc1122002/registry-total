import "./Navigation.css";
// import { DarkModeContext } from "../../context/darkModeContext";
// import { useContext } from "react";
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth';
import { useEffect } from 'react'
import decode from 'jwt-decode';

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

const Navigation = () => {
//   const { dispatch } = useContext(DarkModeContext);
    const user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()

    const checkExpired = () => {
      const token = JSON.parse(localStorage.getItem('accessToken'))
      if (token) {
        const decodedToken = decode(token);
        
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          dispatch(logout())
          console.log("hi from expired")
        }
      }
    }
    useEffect(() => {
      setInterval(() => {
        checkExpired()
      }, 5000)
    }, []);

    const handleLogout = (e) => {
      e.preventDefault()
      dispatch(logout())
    }

    return (
      <div className="navbar">
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              style={{marginRight: 'auto', color: 'rgb(63, 81, 181)'}}
            >
              <MenuIcon />
          </IconButton>
          <div className="search-bar">
              <Search>
                  <SearchIconWrapper>
                  <SearchIcon style={{fontSize: '16px'}}/>
                  </SearchIconWrapper>
                  <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  />
              </Search>
          </div>
          <button className='primary-btn' type="submit" onClick={handleLogout}>Sign Out</button>
          
      </div>
    );
};

export default Navigation;