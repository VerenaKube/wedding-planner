import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {useSeatingPlanContext} from "../SeatingPlanContext.tsx";

export default function TableData() {
    const {seatingPlan, updateTableData} = useSeatingPlanContext(); // 🆕 hole tableData dazu
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [tableType, setTableType] = useState<'ROUND' | 'SQUARE' | 'WEDDING_TABLE' | undefined>(undefined);
    const [numberOfTables, setNumberOfTables] = useState<number | ''>('');
    const [seatsPerTable, setSeatsPerTable] = useState<number | ''>('');

    // 🧠 Context-Daten beim ersten Laden übernehmen
    useEffect(() => {
        if (seatingPlan.tableData) {
            if (seatingPlan.tableData.type) setTableType(seatingPlan.tableData.type);
            if (seatingPlan.tableData.numberOfTables) setNumberOfTables(seatingPlan.tableData.numberOfTables);
            if (seatingPlan.tableData.seatsPerTable) setSeatsPerTable(seatingPlan.tableData.seatsPerTable);

            // Step entsprechend setzen
            let newStep: 1 | 2 | 3 | 4 = 1;
            if (seatingPlan.tableData.type) newStep = 2;
            if (seatingPlan.tableData.type && seatingPlan.tableData.numberOfTables) newStep = 3;
            if (seatingPlan.tableData.type && seatingPlan.tableData.numberOfTables && seatingPlan.tableData.seatsPerTable) newStep = 4;
            setStep(newStep);
        }
    }, [seatingPlan.tableData]);

    // Diese Funktionen werden jetzt bei Änderungen direkt aufgerufen
    const handleTableTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTableType = e.target.value === "" ? undefined : (e.target.value as 'ROUND' | 'SQUARE' | 'WEDDING_TABLE');
        setTableType(newTableType);

        // Direkt im Context speichern
        updateTableData({
            type: newTableType,
            numberOfTables: Number(numberOfTables),
            seatsPerTable: Number(seatsPerTable),
        });

        // Step aktualisieren
        if (newTableType) setStep((prev) => (prev < 2 ? 2 : prev));
    };

    const handleNumberOfTablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumberOfTables = Number(e.target.value);
        setNumberOfTables(newNumberOfTables);

        // Direkt im Context speichern
        updateTableData({
            type: tableType,
            numberOfTables: newNumberOfTables,
            seatsPerTable: Number(seatsPerTable),
        });

        // Step aktualisieren
        if (newNumberOfTables) setStep((prev) => (prev < 3 ? 3 : prev));
    };

    const handleSeatsPerTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSeatsPerTable = Number(e.target.value);
        setSeatsPerTable(newSeatsPerTable);

        // Direkt im Context speichern
        updateTableData({
            type: tableType,
            numberOfTables: Number(numberOfTables),
            seatsPerTable: newSeatsPerTable,
        });

        // Step aktualisieren
        if (newSeatsPerTable) setStep((prev) => (prev < 4 ? 4 : prev));
    };

    const switchToOverview = () => {
        navigate('/overview');
    };

    return (
        <div className="w-screen min-h-screen flex flex-col items-center mt-40">
            <NavBar/>
            <button
                className="fixed bottom-0 left-0 -translate-y-1/2 z-999 mb-5 mt-30 hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md  flex justify-center w-1/6 !text-xl ml-12 hover:!scale-102"
                onClick={switchToOverview}
            >
                Zurück
            </button>

            <div className="flex flex-1 flex-col items-center justify-start gap-15 mt-20 px-4">
                {/* Frage 1 */}
                <div className="flex items-center gap-4">
                    <label className="text-xl font-semibold">
                        Habt ihr eckige oder runde Tische?
                    </label>
                    <select
                        className="border rounded-md px-4 py-2 text-[rgb(97,30,38)] border-[rgb(97,30,38)]"
                        value={tableType || ""}
                        onChange={handleTableTypeChange} // Verwende direkt den onChange Handler
                    >
                        <option value="">Bitte wählen</option>
                        <option value="ROUND">Rund</option>
                        <option value="SQUARE">Eckig</option>
                        <option value="WEDDING_TABLE">Hochzeitstafel</option>
                    </select>
                </div>

                {/* Frage 2 */}
                {step >= 2 && (
                    <div className="flex items-center gap-4">
                        <label className="text-xl font-semibold">
                            Wie viele Tische gibt es?
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={numberOfTables}
                            onChange={handleNumberOfTablesChange} // Verwende direkt den onChange Handler
                            className="border rounded-md px-4 py-2 w-28 text-[rgb(97,30,38)] border-[rgb(97,30,38)]"
                        />
                    </div>
                )}

                {/* Frage 3 */}
                {step >= 3 && (
                    <div className="flex items-center gap-4">
                        <label className="text-xl font-semibold">
                            Wie viele Personen passen an einen Tisch?
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={seatsPerTable}
                            onChange={handleSeatsPerTableChange} // Verwende direkt den onChange Handler
                            className="border rounded-md px-4 py-2 w-28 text-[rgb(97,30,38)] border-[rgb(97,30,38)]"
                        />
                    </div>
                )}

                {/* Weiter Button */}
                {step === 4 && (
                    <button
                        onClick={switchToOverview}
                        type="submit"
                        className="hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md hover:bg-[rgb(120,40,50)] flex justify-center w-full !text-xl"
                    >
                        Weiter
                    </button>
                )}
            </div>

            <Footer/>
        </div>
    );
}
