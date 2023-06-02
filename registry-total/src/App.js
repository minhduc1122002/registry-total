import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./page/Login/Login"
import Dashboard from "./page/Dashboard/Dashboard"
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
    return (
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/login"/> : <Dashboard/>} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
        </Routes>
      </Router>
    );
}

export default App;
