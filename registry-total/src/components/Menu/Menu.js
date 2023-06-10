import "./Menu.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from "react-router-dom";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const role = user.role
    return (
        <div className="sidebar">
            <div className="logo">
                <FontAwesomeIcon icon={faCar} className="icon"/>
                <p>Registry Total</p>
            </div>
            <hr className="line"/>
            <ul>
                <div className="menu-part"><h2>Main</h2></div>
                <NavLink to="/">
                    {({ isActive, isPending }) => (
                        <li>
                            <div className={isActive ? "css-zsxelz" : "css-cxolhu"}>
                                <DashboardIcon className={isActive ? "css-pys03g" : "css-120kvgf"}/>
                                <div className="css-oo3m22">
                                    <span>Dashboard</span>
                                </div>
                            </div>
                        </li>
                    )}
                </NavLink>
                <div className="menu-part"><h2>Table</h2></div>
                <NavLink to="/inspections">
                    {({ isActive, isPending }) => (
                        <li>
                            <div className={isActive ? "css-zsxelz" : "css-cxolhu"}>
                                <ListAltIcon className={isActive ? "css-pys03g" : "css-120kvgf"}/>
                                <div className="css-oo3m22">
                                    <span>Giấy Đăng Kiểm</span>
                                </div>
                            </div>
                        </li>
                    )}
                </NavLink>
                <NavLink to="/car">
                    {({ isActive, isPending }) => (
                        <li>
                            <div className={isActive ? "css-zsxelz" : "css-cxolhu"}>
                                <DirectionsCarIcon className={isActive ? "css-pys03g" : "css-120kvgf"}/>
                                <div className="css-oo3m22">
                                    <span>Xe Ô Tô</span>
                                </div>
                            </div>
                        </li>
                    )}
                </NavLink>
                <NavLink to="/analysis">
                    {({ isActive, isPending }) => (
                        <li>
                            <div className={isActive ? "css-zsxelz" : "css-cxolhu"}>
                                <TimelineIcon className={isActive ? "css-pys03g" : "css-120kvgf"}/>
                                <div className="css-oo3m22">
                                    <span>Thống Kê</span>
                                </div>
                            </div>
                        </li>
                    )}
                </NavLink>
                {user.role === 'department' && 
                <NavLink to="/center">
                    {({ isActive, isPending }) => (
                        <li>
                            <div className={isActive ? "css-zsxelz" : "css-cxolhu"}>
                                <BusinessIcon className={isActive ? "css-pys03g" : "css-120kvgf"}/>
                                <div className="css-oo3m22">
                                    <span>Trung Tâm</span>
                                </div>
                            </div>
                        </li>
                    )}
                </NavLink>
                }
            </ul>
        </div>
    );
};

export default Sidebar;