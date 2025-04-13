import NavBar from "./Navbar.tsx";
import paar from "../assets/images/paar.png";
import gaeste from "../assets/images/Gaeste.png";
import sonderregeln from "../assets/images/Sonderregeln.png";
import tisch from "../assets/images/Tisch.png";
import ergebnis from "../assets/images/Ergebnis.png";
import {useNavigate} from "react-router-dom";
import Footer from "./Footer.tsx";

export default function SeatingPlanOverview() {
    const navigate = useNavigate();
    const switchToGeneralData = () => {
        navigate('/general-data');
    };

    const switchToGuests = () => {
        navigate('/guests');
    };

    const switchToSpecialRules = () => {
        navigate('/special-rules');
    };

    const switchToTableData = () => {
        navigate('/table-data');
    };

    const switchToResult = () => {
        navigate('/result');
    };


    return (
        <div>
            <NavBar/>
            <div className="h-screen w-full flex flex-col justify-center items-center px-10 mt-40 mb-20"
                 style={{width: '100vw', height: '100vh'}}>
                <div className="flex flex-wrap justify-center gap-20">
                    {/* Deine Karten hier */}
                    <div className="card-design-with-picture"
                         onClick={() => switchToGeneralData()}>
                        <div
                            className="w-full h-full rounded overflow-hidden shadow-lg flex flex-col bg-[rgb(97,30,38)]">
                            <div className="h-1/2 flex justify-center items-center">
                                <img className="w-auto h-auto object-contain" src={paar} alt="Sunset in the mountains"/>
                            </div>
                            <div className="h-1/2 flex flex-col justify-center items-center px-6 py-4">
                                <div className="font-bold text-xl mb-2 text-center text-white">Allgemeine Daten</div>
                                <p className="text-white text-base text-center">
                                    Gebt gerne die Randdaten eurer Hochzeit ein!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="card-design-with-picture"
                         onClick={() => switchToGuests()}>
                        <div
                            className="w-full h-full rounded overflow-hidden shadow-lg flex flex-col bg-[rgb(97,30,38)]">
                            <div className="h-1/2 flex justify-center items-center">
                                <img className="w-auto h-auto object-contain" src={gaeste}
                                     alt="Sunset in the mountains"/>
                            </div>
                            <div className="h-1/2 flex flex-col justify-center items-center px-6 py-4">
                                <div className="font-bold text-xl mb-2 text-center text-white">Gästeliste</div>
                                <p className="text-white text-base text-center">
                                    Hier könnt ihr eure Gäste hinzufügen. Ihr habt einen Freundeskreis? Kein Problem,
                                    das könnt ihr hier angeben!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-design-with-picture"
                         onClick={() => switchToSpecialRules()}>
                        <div
                            className="w-full h-full rounded overflow-hidden shadow-lg flex flex-col bg-[rgb(97,30,38)]">
                            <div className="h-1/2 flex justify-center items-center">
                                <img className="w-auto h-auto object-contain" src={sonderregeln}
                                     alt="Sunset in the mountains"/>
                            </div>
                            <div className="h-1/2 flex flex-col justify-center items-center px-6 py-4">
                                <div className="font-bold text-xl mb-2 text-center text-white">Sonderregeln</div>
                                <p className="text-white text-base text-center">
                                    Wer soll auf jeden Fall zusammensitzen? Und wer lieber nicht? Teilt es uns mit!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-design-with-picture"
                         onClick={() => switchToTableData()}>
                        <div
                            className="w-full h-full rounded overflow-hidden shadow-lg flex flex-col bg-[rgb(97,30,38)]">
                            <div className="h-1/2 flex justify-center items-center">
                                <img className="w-auto h-auto object-contain" src={tisch}
                                     alt="Sunset in the mountains"/>
                            </div>
                            <div className="h-1/2 flex flex-col justify-center items-center px-6 py-4">
                                <div className="font-bold text-xl mb-2 text-center text-white">Tische</div>
                                <p className="text-white text-base text-center">
                                    Freistehend oder Tafel? Rund oder eckig? Wir wollen es wissen!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-design-with-picture-bigger"
                         onClick={() => switchToResult()}>
                        <div
                            className="w-full h-full rounded overflow-hidden shadow-lg flex flex-col bg-[rgb(97,30,38)]">
                            <div className="h-1/2 flex justify-center items-center">
                                <img className="w-auto h-auto object-contain" src={ergebnis}
                                     alt="Sunset in the mountains"/>
                            </div>
                            <div className="h-1/2 flex flex-col justify-center items-center px-6 py-4">
                                <div className="font-bold text-2xl mb-2 text-center text-white">Ergebnis</div>
                                <p className="text-white text-base text-center">
                                    Wir freuen uns euch euren Sitzplan zu zeigen! Ihr habt noch Änderungen? Kein
                                    Problem, ihr könnt eure Gäste hier noch verschieben!
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <Footer/>
        </div>
    );
}
