import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import hochzeitsbild from "../assets/images/Hochzeitsbild.png";
import {useState} from "react";
import {SeatingplanCreationRequest} from "../api-client";
import {createSeatingPlan} from "../services/generateSeatingplan.ts";
import {useNavigate} from "react-router-dom";


export default function GeneralData() {
    const [seatingPlan, setSeatingPlan] = useState<SeatingplanCreationRequest>({
        name: '',
        weddingDate: '',
        bride: '',
        groom: '',
    });

    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSeatingPlan((prev) => ({
            ...prev,
            [name]: value,  // Das sorgt dafür, dass der Zustand korrekt aktualisiert wird
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createSeatingPlan(seatingPlan);
            console.log('Sitzplan erfolgreich erstellt:', response);
        } catch (error) {
            console.error('Fehler beim Erstellen des Sitzplans:', error);
        }
    };

    return (
        <div className="relative">
            <NavBar/>

            {/* Das Bild auf der rechten Seite */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pt-30">
                <img
                    src={hochzeitsbild}
                    alt="Rechts positioniertes Bild"
                    className="rounded-l-full h-150"
                />
            </div>

            <div className="fixed left-10 right-10 top-8 p-4 mt-22 text-center">
                <h1 className="text-[rgb(97,30,38)]">
                    Allgemeine Daten
                </h1>
                <hr className="my-5 border-t-1" style={{borderTopColor: 'rgb(97,30,38)'}}/>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="h-screen flex flex-col justify-center pt-30 pl-100"
                     style={{width: '100vw', height: '100vh'}}>
                    <div className="mt-10 w-2/5">
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]">
                                    Name eures Sitzplans
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="white-textfield-on-red-background"
                                        placeholder="Max und Marias Sitzplan"
                                        name="name"  // Das `name`-Attribut muss hier übereinstimmen
                                        value={seatingPlan.name}
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
                                        name="weddingDate"  // Hier auch
                                        value={seatingPlan.weddingDate}
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
                                        name="bride"  // Hier auch
                                        value={seatingPlan.bride}
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
                                        name="groom"  // Hier auch
                                        value={seatingPlan.groom}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex items-center mb-4 w-2/5 pt-6">
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
