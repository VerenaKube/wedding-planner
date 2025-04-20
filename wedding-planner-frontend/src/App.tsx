// src/App.tsx
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './views/Login.tsx';
import SeatingPlanOverview from './views/SeatingPlanOverview.tsx';
import Welcome from './views/Welcome.tsx';
import Registration from './views/Registration.tsx';
import ResetPassword from './views/ResetPassword.tsx';
import GeneralData from './views/GeneralData.tsx';
import Guests from './views/Guests.tsx';
import SpecialRules from './views/SpecialRules.tsx';
import Result from './views/Result.tsx';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import TableData from './views/TableData.tsx';
import Home from './views/Home.tsx';

import {SeatingPlanProvider} from './SeatingPlanContext.tsx'; // Importiere den GuestProvider

function App() {
    return (
        <div style={{fontFamily: 'Bad Script, sans-serif'}}>
            <DndProvider backend={HTML5Backend}>
                <SeatingPlanProvider>  {/* Wickle deine gesamte App im GuestProvider ein */}
                    <Router>
                        <Routes>
                            <Route path="/" element={<Login/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/overview" element={<SeatingPlanOverview/>}/>
                            <Route path="/welcome" element={<Welcome/>}/>
                            <Route path="/registration" element={<Registration/>}/>
                            <Route path="/password-reset" element={<ResetPassword/>}/>
                            <Route path="/general-data" element={<GeneralData/>}/>
                            <Route path="/guests" element={<Guests/>}/>
                            <Route path="/special-rules" element={<SpecialRules/>}/>
                            <Route path="/overview" element={<SeatingPlanOverview/>}/>
                            <Route path="/home" element={<Home/>}/>
                            <Route path="/result" element={<Result/>}/>
                            <Route path="/table-data" element={<TableData/>}/>
                        </Routes>
                    </Router>
                </SeatingPlanProvider>
            </DndProvider>
        </div>
    );
}

export default App;
