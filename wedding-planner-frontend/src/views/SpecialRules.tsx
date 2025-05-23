import {useState} from "react";
import {useSeatingPlanContext} from "../SeatingPlanContext.tsx";
import Footer from "./Footer.tsx";
import NavBar from "./Navbar.tsx";
import {GuestDto} from "../api-client";
import check from "../assets/images/check.png";
import {useNavigate} from "react-router-dom";

export default function SpecialRules() {
    const {seatingPlan, addSeatingRule, removeSeatingRule} = useSeatingPlanContext();

    const [selectedGuestFriend1, setSelectedGuestFriend1] = useState<GuestDto | null>(null);
    const [selectedGuestFriend2, setSelectedGuestFriend2] = useState<GuestDto | null>(null);
    const [selectedGuestEnemy1, setSelectedGuestEnemy1] = useState<GuestDto | null>(null);
    const [selectedGuestEnemy2, setSelectedGuestEnemy2] = useState<GuestDto | null>(null);

    const handleAddFriendRule = () => {
        if (selectedGuestFriend1 && selectedGuestFriend2) {
            addSeatingRule(selectedGuestFriend1, selectedGuestFriend2, "FRIEND");
            setSelectedGuestFriend1(null);
            setSelectedGuestFriend2(null);
        }
    };

    const handleAddEnemyRule = () => {
        if (selectedGuestEnemy1 && selectedGuestEnemy2) {
            addSeatingRule(selectedGuestEnemy1, selectedGuestEnemy2, "ENEMY");
            setSelectedGuestEnemy1(null);
            setSelectedGuestEnemy2(null);
        }
    };

    const getFullName = (guest: GuestDto) => `${guest.firstName} ${guest.lastName}`;

    const renderGuestOptions = () => (seatingPlan.guestList ?? [])
        .flatMap((circle) => circle.members || [])
        .map((guest: GuestDto) => (
            <option key={getFullName(guest)} value={getFullName(guest)}>
                {getFullName(guest)}
            </option>
        ));

    const findGuestByName = (name: string) => (seatingPlan.guestList ?? [])
        .flatMap((circle) => circle.members || [])
        .find((g) => getFullName(g) === name) || null;

    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <button
                className="fixed bottom-0 left-0 -translate-y-1/2 z-999 mb-5 hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md flex justify-center w-1/6 !text-xl ml-12 hover:!scale-102"
                onClick={switchToOverview}
            >
                Zurück
            </button>

            <div className="flex flex-1 w-screen mt-25">
                {/* Freunde Section */}
                <div className="w-1/2 p-4">
                    <h2 className="headline-white-background">Wer soll auf jeden Fall zusammensitzen?</h2>
                    <div className="flex flex-col items-center">
                        <span className="flex gap-5 mt-20">
                            <div>
                                <select
                                    value={selectedGuestFriend1 ? getFullName(selectedGuestFriend1) : ""}
                                    onChange={(e) => setSelectedGuestFriend1(findGuestByName(e.target.value))}
                                >
                                    <option value="">Wählen Sie den ersten Gast</option>
                                    {renderGuestOptions()}
                                </select>
                            </div>
                            <span className="text-red-500 text-xl">❤</span>
                            <div>
                                <select
                                    value={selectedGuestFriend2 ? getFullName(selectedGuestFriend2) : ""}
                                    onChange={(e) => setSelectedGuestFriend2(findGuestByName(e.target.value))}
                                >
                                    <option value="">Wählen Sie den zweiten Gast</option>
                                    {renderGuestOptions()}
                                </select>
                            </div>
                            <button
                                className="white-button"
                                onClick={handleAddFriendRule}
                                disabled={!selectedGuestFriend1 || !selectedGuestFriend2}
                            >
                                <img className="w-auto h-5 object-contain" src={check} alt="Check"/>
                            </button>
                        </span>

                        <div className="w-1/2 p-4 mt-10">
                            <h2 className="headline-white-background mb-5">Freunde</h2>
                            <div className="connected-guests-container">
                                {
                                    (seatingPlan.seatingRules ?? [])
                                        .filter((rule) => rule.ruleType === "FRIEND")
                                        .map((rule) => {
                                            const realIndex = (seatingPlan.seatingRules ?? []).indexOf(rule);
                                            return (
                                                <div key={realIndex}
                                                     className="connection flex items-center justify-between">
                                                    <p>
                                                        {getFullName(rule.firstGuest ?? {
                                                            firstName: "Unbekannt",
                                                            lastName: ""
                                                        })}{" "}
                                                        <span className="text-lg text-red-500">⚡</span>{" "}
                                                        {getFullName(rule.secondGuest ?? {
                                                            firstName: "Unbekannt",
                                                            lastName: ""
                                                        })}
                                                    </p>
                                                    <span
                                                        onClick={() => removeSeatingRule(realIndex)}
                                                        className="cursor-pointer text-red-700 hover:text-black hover:!scale-120"
                                                        title="Regel entfernen"
                                                    >
            🗑️
          </span>
                                                </div>
                                            );
                                        })
                                }

                            </div>
                        </div>
                    </div>
                </div>

                {/* Feinde Section */}
                <div className="w-1/2 p-4">
                    <h2 className="headline-white-background">Wer soll auf keinen Fall zusammensitzen?</h2>
                    <div className="flex flex-col items-center">
                        <span className="flex gap-5 mt-20">
                            <div>
                                <select
                                    value={selectedGuestEnemy1 ? getFullName(selectedGuestEnemy1) : ""}
                                    onChange={(e) => setSelectedGuestEnemy1(findGuestByName(e.target.value))}
                                >
                                    <option value="">Wählen Sie den ersten Gast</option>
                                    {renderGuestOptions()}
                                </select>
                            </div>
                            <span className="text-lg text-red-500">⚡</span>
                            <div>
                                <select
                                    value={selectedGuestEnemy2 ? getFullName(selectedGuestEnemy2) : ""}
                                    onChange={(e) => setSelectedGuestEnemy2(findGuestByName(e.target.value))}
                                >
                                    <option value="">Wählen Sie den zweiten Gast</option>
                                    {renderGuestOptions()}
                                </select>
                            </div>
                            <button
                                className="white-button"
                                onClick={handleAddEnemyRule}
                                disabled={!selectedGuestEnemy1 || !selectedGuestEnemy2}
                            >
                                <img className="w-auto h-5 object-contain" src={check} alt="Check"/>
                            </button>
                        </span>

                        <div className="w-1/2 p-4 mt-10">
                            <h2 className="headline-white-background mb-5">Feinde</h2>
                            <div className="connected-guests-container">
                                {
                                    (seatingPlan.seatingRules ?? [])
                                        .filter((rule) => rule.ruleType === "ENEMY")
                                        .map((rule) => {
                                            const realIndex = (seatingPlan.seatingRules ?? []).indexOf(rule);
                                            return (
                                                <div key={realIndex}
                                                     className="connection flex items-center justify-between">
                                                    <p>
                                                        {getFullName(rule.firstGuest ?? {
                                                            firstName: "Unbekannt",
                                                            lastName: ""
                                                        })}{" "}
                                                        <span className="text-lg text-red-500">⚡</span>{" "}
                                                        {getFullName(rule.secondGuest ?? {
                                                            firstName: "Unbekannt",
                                                            lastName: ""
                                                        })}
                                                    </p>
                                                    <span
                                                        onClick={() => removeSeatingRule(realIndex)}
                                                        className="cursor-pointer text-red-700 hover:text-black hover:!scale-120"
                                                        title="Regel entfernen"
                                                    >
            🗑️
          </span>
                                                </div>
                                            );
                                        })
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}
