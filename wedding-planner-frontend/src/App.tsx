import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./views/Login.tsx";
import Home from "./views/Home.tsx";
import Welcome from "./views/Welcome.tsx";
import Registration from "./views/Registration.tsx";
import ResetPassword from "./views/ResetPassword.tsx";
import GeneralData from "./views/GeneralData.tsx";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/welcome" element={<Welcome/>}/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/password-reset" element={<ResetPassword/>}/>
                    <Route path="/general-data" element={<GeneralData/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
