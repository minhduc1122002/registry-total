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
import Export from "./components/Single/Inspection/Print"
import Form from"./page/Form/Form"
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/login"/> : <Dashboard/>} />
          <Route path="/car" element={!user ? <Navigate to="/login"/> : <Car/>} />
          <Route path="/inspections" element={!user ? <Navigate to="/login"/> : <Inspection/>} />
          <Route path="/inspection/form" element={!user ? <Navigate to="/login"/> : <Form/>} />
          <Route path="/inspections/:id" element={!user ? <Navigate to="/login"/> : <Inspection/>} />
          <Route path="/inspection/print/:id" element={!user ? <Navigate to="/login"/> : <Export/>} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
        </Routes>
      </Router>
    );
}

export default App;
