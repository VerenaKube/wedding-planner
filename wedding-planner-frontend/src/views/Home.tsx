// src/pages/.tsx
import {useEffect, useState} from 'react';
import NavBar from './Navbar.tsx';
import Footer from './Footer.tsx';
import {useNavigate} from 'react-router-dom';
import {SeatingplanDto} from '../api-client';
import {getSeatingPlanById, getSeatingPlans} from '../services/generateSeatingplan.ts';
import {useSeatingPlanContext} from '../SeatingPlanContext';

// Home Seite
export default function Home() {
    const navigate = useNavigate();
    const {setSeatingPlan} = useSeatingPlanContext();  // Zugriff auf den Context
    const [seatingplans, setSeatingplans] = useState<SeatingplanDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Funktion für den Wechsel zur Übersicht
    const switchToOverview = () => {
        navigate('/overview');
    };

    // Funktion für das Handling eines Klicks auf eine Sitzplan-Zeile
    const handleRowClick = async (id: string | undefined) => {
        if (id) {  // Überprüfen, ob id definiert ist
            try {
                // API-Aufruf, um den Sitzplan mit der angegebenen ID zu bekommen
                const seatingplan: SeatingplanDto = await getSeatingPlanById(id);
                console.log(seatingplan);  // Hier kannst du mit den Sitzplan-Daten weiterarbeiten

                // Sitzplan im Context setzen
                setSeatingPlan(seatingplan);  // Sitzplan wird im Context gesetzt

                // Weiterleitung zu einer Detailseite für den Sitzplan
                switchToOverview();
            } catch (error) {
                console.error("Fehler beim Laden des Sitzplans:", error);
                setError("Fehler beim Laden des Sitzplans. Bitte versuchen Sie es später erneut.");
            }
        }
    };

    // Laden der Sitzpläne beim ersten Rendern
    useEffect(() => {
        const seatingplan: SeatingplanDto = {}
        setSeatingPlan(seatingplan);
        const fetchSeatingplans = async () => {
            try {
                const data: SeatingplanDto[] = await getSeatingPlans();
                setSeatingplans(data);
            } catch (error) {
                console.error("Fehler beim Laden der Sitzpläne:", error);
                setError("Fehler beim Laden der Sitzpläne. Bitte versuchen Sie es später erneut.");
            } finally {
                setLoading(false);
            }
        };

        fetchSeatingplans();
    }, []);

    return (
        <div>
            <NavBar/>

            <div className="w-screen min-h-screen flex flex-col items-center mt-40">
                <button
                    className="red-button w-1/5 mb-10"
                    onClick={switchToOverview}
                >
                    <span className="flex items-center justify-center gap-2">
                        <p className="text-2xl leading-none py-2">+ </p>
                        <p className="text-2xl leading-none py-2">Neuer Sitzplan</p>
                    </span>
                </button>

                {/* Ladeanzeige */}
                {loading && <p className="red-font-center-aligned mt-10">Lädt...</p>}

                {/* Fehleranzeige */}
                {error && <p className="red-font-center-aligned mt-10">{error}</p>}

                {/* Tabelle der vorhandenen Sitzpläne */}
                <div className="w-3/5 mt-20">
                    <p className="red-font-center-aligned text-2xl mb-4">Vorhandene Sitzpläne</p>

                    <table className="min-w-full bg-white border border-gray-500 rounded-lg overflow-hidden mt-10">
                        <thead className="bg-[rgb(97,30,38)] text-xl">
                        <tr>
                            <th className="white-font-center-aligned py-5 border-b hidden">ID</th>
                            <th className="white-font-center-aligned py-5 border-b">Name</th>
                            <th className="white-font-center-aligned py-5 border-b">Hochzeitsdatum</th>
                        </tr>
                        </thead>
                        <tbody>
                        {seatingplans.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-4 red-font-center-aligned">
                                    Keine Sitzpläne gefunden
                                </td>
                            </tr>
                        ) : (
                            seatingplans.map((plan, index) => (
                                <tr
                                    key={plan.id}
                                    className={`hover:bg-red-50 transition cursor-pointer ${
                                        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                    }`}  // Abwechselnde Hintergrundfarben
                                    onClick={() => handleRowClick(plan.id)}  // Klick-Handler für Zeilen
                                >
                                    <td className="hidden">{plan.id}</td>
                                    {/* versteckte UUID-Zelle */}
                                    <td className="red-font-center-aligned px-4 py-2 border-b">
                                        {plan.name}
                                    </td>
                                    <td className="red-font-center-aligned px-4 py-2 border-b">
                                        {plan.weddingDate
                                            ? new Date(plan.weddingDate).toLocaleDateString('de-DE', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : 'Kein Datum verfügbar'}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer/>
        </div>
    );
}
