import {useEffect, useState} from 'react';
import NavBar from './Navbar.tsx';
import Footer from './Footer.tsx';
import {useNavigate} from 'react-router-dom';
import {SeatingplanDto} from '../api-client';
import {deleteSeatingplan, getSeatingPlanById, getSeatingPlans} from '../services/generateSeatingplan.ts';
import {useSeatingPlanContext} from '../SeatingPlanContext.tsx';

export default function Home() {
    const navigate = useNavigate();
    const {setSeatingPlan} = useSeatingPlanContext();
    const [seatingplans, setSeatingplans] = useState<SeatingplanDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const switchToOverview = () => {
        navigate('/overview');
    };

    const handleRowClick = async (id: string | undefined) => {
        if (id) {
            try {
                const seatingplan: SeatingplanDto = await getSeatingPlanById(id);
                console.log(seatingplan);
                setSeatingPlan(seatingplan);
                switchToOverview();
            } catch (error) {
                console.error("Fehler beim Laden des Sitzplans:", error);
                setError("Fehler beim Laden des Sitzplans. Bitte versuchen Sie es später erneut.");
            }
        }
    };

    const handleDeletePlan = async (id: string | undefined) => {
        if (id) {
            try {
                await deleteSeatingplan(id);
                setSeatingplans(prevPlans => prevPlans.filter(plan => plan.id !== id));
            } catch (error) {
                console.error("Fehler beim Löschen des Sitzplans:", error);
                setError("Fehler beim Löschen des Sitzplans. Bitte versuchen Sie es später erneut.");
            }
        }
    };

    useEffect(() => {
        setSeatingPlan({} as SeatingplanDto);
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
    }, []); // leeres Dependency-Array


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

                {loading && <p className="red-font-center-aligned mt-10">Lädt...</p>}
                {error && <p className="red-font-center-aligned mt-10">{error}</p>}

                <div className="w-3/5 mt-20">
                    <p className="red-font-center-aligned text-2xl mb-4">Vorhandene Sitzpläne</p>

                    <table className="min-w-full bg-white border border-gray-500 rounded-lg overflow-hidden mt-10">
                        <thead className="bg-[rgb(97,30,38)] text-xl">
                        <tr>
                            <th className="white-font-center-aligned py-5 border-b hidden">ID</th>
                            <th className="white-font-center-aligned py-5 border-b">Name</th>
                            <th className="white-font-center-aligned py-5 border-b">Hochzeitsdatum</th>
                            {/* Leere, schmale Spalte für Löschen */}
                            <th className="py-5 border-b" style={{width: "40px"}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {seatingplans.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-4 red-font-center-aligned">
                                    Keine Sitzpläne gefunden
                                </td>
                            </tr>
                        ) : (
                            seatingplans.map((plan, index) => (
                                <tr
                                    key={plan.id}
                                    className={`hover:bg-red-50 transition cursor-pointer ${
                                        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                    }`}
                                >
                                    <td className="hidden">{plan.id}</td>
                                    <td
                                        className="red-font-center-aligned px-4 py-2 border-b"
                                        onClick={() => handleRowClick(plan.id)}
                                    >
                                        {plan.name}
                                    </td>
                                    <td
                                        className="red-font-center-aligned px-4 py-2 border-b"
                                        onClick={() => handleRowClick(plan.id)}
                                    >
                                        {plan.weddingDate
                                            ? new Date(plan.weddingDate).toLocaleDateString('de-DE', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : 'Kein Datum verfügbar'}
                                    </td>
                                    <td className="red-font-center-aligned px-4 py-2 border-b">

                                        <span
                                            onClick={() => handleDeletePlan(plan.id)}
                                            className="cursor-pointer text-red-700 hover:text-black hover:!scale-120 "
                                            title="Sitzplan entfernen"
                                        >
                                        🗑️
                                            </span>

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
