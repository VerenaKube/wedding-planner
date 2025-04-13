import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import hochzeitsbild from "../assets/images/Hochzeitsbild.png";
import {useEffect, useState} from "react";
import {SeatingplanCreationRequest} from "../api-client";
import {createSeatingPlan} from "../services/generateSeatingplan.ts";
import {useNavigate} from "react-router-dom";
import {useSeatingPlanContext} from "../SeatingPlanContext.tsx";

export default function GeneralData() {
    // Hole die Daten aus dem Kontext
    const {seatingPlan} = useSeatingPlanContext();

    // Initialisiere den Zustand mit den Daten aus dem Context (falls vorhanden)
    const [formData, setFormData] = useState<SeatingplanCreationRequest>({
        name: seatingPlan.name || '',
        weddingDate: seatingPlan.weddingDate || '',  // Standardwert leere Zeichenkette
        bride: seatingPlan.bride || '',  // Standardwert leere Zeichenkette
        groom: seatingPlan.groom || '',  // Standardwert leere Zeichenkette
    });

    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, // Das sorgt dafür, dass der Zustand korrekt aktualisiert wird
        }));
    };

    const {setSeatingPlanUUID, updateGeneralData} = useSeatingPlanContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Überprüfe, ob die UUID gesetzt ist
        if (seatingPlan.id) {
            // UUID existiert, führe nur updateGeneralData aus
            updateGeneralData(formData.name, formData.weddingDate, formData.bride, formData.groom);
        } else {
            // UUID ist nicht gesetzt, führe den Create-Call aus
            try {
                const response = await createSeatingPlan(formData);
                setSeatingPlanUUID(response);
                console.log('Sitzplan erfolgreich erstellt:', response);
            } catch (error) {
                console.error('Fehler beim Erstellen des Sitzplans:', error);
            }
        }
    };


    // Lade die Werte beim ersten Rendern aus dem Context
    useEffect(() => {
        if (seatingPlan.name) {
            setFormData({
                name: seatingPlan.name || '',
                weddingDate: seatingPlan.weddingDate || '',
                bride: seatingPlan.bride || '',
                groom: seatingPlan.groom || '',
            });
        }
    }, [seatingPlan]); // Abhängig vom `seatingPlan` im Context

    return (
        <div>
            <NavBar/>

            <button
                className="fixed bottom-0 left-0 -translate-y-1/2 z-999 mb-5 mt-30 hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md  flex justify-center w-1/6 !text-xl ml-12 hover:!scale-102"
                onClick={switchToOverview}
            >

                Zurück
            </button>


            {/* Das Bild auf der rechten Seite */}
            <div className="fixed top-1/2 right-0 transform -translate-y-1/2">
                <img
                    src={hochzeitsbild}
                    alt="Rechts positioniertes Bild"
                    className="rounded-l-full h-120"
                />
            </div>


            <div className="fixed left-100 right-100 top-8  mt-22 text-center">
                <h1 className="text-[rgb(97,30,38)]">
                    Allgemeine Daten
                </h1>
                <hr className="my-5 border-t-1" style={{borderTopColor: 'rgb(97,30,38)'}}/>
            </div>

            <form onSubmit={handleSubmit} className=" fixed-center overflow-hidden">
                <div className="flex flex-col items-center max-w-full"
                     style={{width: '100vw'}}>
                    <div className="w-2/5">
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]">
                                    Name eures Sitzplans
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="white-textfield-on-red-background"
                                        placeholder="Max und Marias Sitzplan"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]">
                                    Datum eurer Hochzeit
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="white-textfield-on-red-background"
                                        placeholder="01.06.2025"
                                        name="weddingDate"
                                        value={formData.weddingDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]">
                                    Name der Braut
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="white-textfield-on-red-background"
                                        placeholder="Maria"
                                        name="bride"
                                        value={formData.bride}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]">
                                    Name des Bräutigams
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="white-textfield-on-red-background"
                                        placeholder="Max"
                                        name="groom"
                                        value={formData.groom}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center w-2/5 pt-6">
                        <button
                            onClick={switchToOverview}
                            type="submit"
                            className="hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md hover:bg-[rgb(120,40,50)] flex justify-center w-full !text-xl"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            </form>


            <Footer/>
        </div>
    );
}
