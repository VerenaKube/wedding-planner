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
    const switchToHome = () => {
        navigate('/home');
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
                <h1 className="text-[rgb(97,30,38)]" style={{fontFamily: 'Bad Script, sans-serif'}}>
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
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]"
                                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                                    Name eures Sitzplans
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="hover:border-black block w-full text-2xl rounded-md bg-white px-3 py-1.5 text-base text-red-900 border-1 border-transparent outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline- focus:outline-white-600 sm:text-sm"
                                        placeholder="Max und Marias Sitzplan"
                                        name="name"  // Das `name`-Attribut muss hier übereinstimmen
                                        value={seatingPlan.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]"
                                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                                    Datum eurer Hochzeit
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="hover:border-black block w-full text-2xl rounded-md bg-white px-3 py-1.5 text-base text-red-900 border-1 border-transparent outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline- focus:outline-white-600 sm:text-sm"
                                        placeholder="01.06.2025"
                                        name="weddingDate"  // Hier auch
                                        value={seatingPlan.weddingDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]"
                                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                                    Name der Braut
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="hover:border-black block w-full text-2xl rounded-md bg-white px-3 py-1.5 text-base text-red-900 border-1 border-transparent outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline- focus:outline-white-600 sm:text-sm"
                                        placeholder="Maria"
                                        name="bride"  // Hier auch
                                        value={seatingPlan.bride}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <p className="block text-xl text-black flex-1 !text-[rgb(97,30,38)]"
                                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                                    Name des Bräutigams
                                </p>
                                <div className="mt-2 flex-1 text-2xl">
                                    <input
                                        className="hover:border-black block w-full text-2xl rounded-md bg-white px-3 py-1.5 text-base text-red-900 border-1 border-transparent outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline- focus:outline-white-600 sm:text-sm"
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
                            onClick={switchToHome}
                            type="submit"
                            className="hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md hover:bg-[rgb(120,40,50)] flex justify-center w-full !text-xl"
                            style={{fontFamily: 'Bad Script, sans-serif'}}
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
