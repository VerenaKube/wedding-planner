import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Login.tsx";
import Home from "./Home.tsx";
import Welcome from "./Welcome.tsx";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/welcome" element={<Welcome/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
