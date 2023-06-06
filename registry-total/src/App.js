import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./page/Login/Login"
import Dashboard from "./page/Dashboard/Dashboard"
import Car from "./page/Car/Car"
import Inspection from "./page/Inspection/Inspection"
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/login"/> : <Dashboard/>} />
          <Route path="/car" element={!user ? <Navigate to="/login"/> : <Car/>} />
          <Route path="/inspection" element={!user ? <Navigate to="/login"/> : <Inspection/>} />
          <Route path="/inspection/:id" element={!user ? <Navigate to="/login"/> : <Inspection/>} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
        </Routes>
      </Router>
    );
}

export default App;
