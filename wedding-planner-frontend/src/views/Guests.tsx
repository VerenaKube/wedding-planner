import {useState} from "react";
import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function Guests() {
    const [cards, setCards] = useState<{ id: number; name: string; alter: string }[]>([]);
    const [name, setName] = useState("");  // FEHLER: Diese Zeile hat gefehlt
    const [alter, setAlter] = useState("");  // FEHLER: Diese Zeile hat gefehlt

    const addCard = () => {
        if (name.trim() !== "" && alter.trim() !== "") {
            setCards((prevCards) => [...prevCards, {id: prevCards.length + 1, name, alter}]);
            setName("");
            setAlter("");
        }
    };

    const Card = ({name, alter}: { name: string; alter: string }) => (
        <div className="bg-[rgb(97,30,38)] shadow-lg rounded-xl p-6 w-full max-w-md text-center text-white">
            <p className="text-sm mt-1">Name: {name}</p>
            <p className="text-sm mt-1">Alter: {alter}</p>
        </div>
    );

    return (
        <div>
            <NavBar/>
            <div className="w-screen flex flex-col items-center mt-35">
                <div className="bg-[rgb(97,30,38)] shadow-lg rounded-xl p-4 w-100 h-80 text-center text-sm">
                    <p className="text-white text-lg">Gast hinzufügen</p>
                    <hr className="mt-2 border-white"/>

                    {/* Name */}
                    <div className="mt-2 flex">
                        <p className="flex-1 text-base text-white flex items-end">Name</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Text eingeben..."
                            className="flex-1 border border-white placeholder:text-white p-1 rounded w-full mt-3 bg-transparent text-white"
                        />
                    </div>

                    {/* Alter */}
                    <div className="flex mt-2">
                        <p className="flex-1 text-base text-white flex items-end">Alter</p>
                        <input
                            type="text"
                            value={alter}
                            onChange={(e) => setAlter(e.target.value)}
                            placeholder="Text eingeben..."
                            className="flex-1 border border-white placeholder:text-white p-1 rounded w-full mt-3 bg-transparent text-white"
                        />
                    </div>

                    <div className="flex mt-4">
                        <button
                            onClick={addCard}
                            type="button"
                            className="hover:!border-black flex-1 rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 focus:outline-3 sm:text-sm">
                            Erstellen
                        </button>
                    </div>
                </div>
            </div>

            {/* Karten-Container */}
            <div className="w-full flex flex-col justify-center mt-20 mb-30">
                <div className="sm:mx-auto">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full px-6 justify-center items-center">
                        {cards.map((card) => (
                            <Card key={card.id} name={card.name} alter={card.alter}/>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
