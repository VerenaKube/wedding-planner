import {useEffect} from "react";
import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {useSeatingPlanContext} from "../SeatingPlanContext.tsx";
import GraphicalTable from "./GraphicalTable.tsx";
import {generateSeatingPlanSolution} from "../services/generateSeatingplan";
import {useNavigate} from "react-router-dom"; // Importiere die Methode

export default function Result() {
    const {seatingPlan, updateSolution} = useSeatingPlanContext();

    const tables = seatingPlan.solution?.tables ?? [];

    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    }

    useEffect(() => {
        (async () => {
            if (!seatingPlan.id) return;
            const sol = await generateSeatingPlanSolution(seatingPlan.id);
            updateSolution(sol!);
        })();
    }, [seatingPlan.id]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center mt-40" style={{width: "99vw"}}>
            <NavBar/>
            <button
                className="fixed bottom-0 left-0 -translate-y-1/2 z-999 mb-5 mt-30 hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md  flex justify-center w-1/6 !text-xl ml-12 hover:!scale-102"
                onClick={switchToOverview}
            >

                Zurück
            </button>
            {/* Überschrift */}
            <h1 className="headline-white-background !text-4xl mb-10">
                Hier ist euer generierter Sitzplan!
            </h1>

            <div className="w-full flex flex-wrap justify-center gap-8 mt-8">
                {tables.length > 0 ? (
                    tables.map((table, idx) => (
                        <GraphicalTable key={idx} table={table}/>
                    ))
                ) : (
                    <div className="text-gray-500 text-lg mt-10">
                        Noch keine Sitzordnung generiert.
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    );
}
