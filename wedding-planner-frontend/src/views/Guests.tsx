import {useEffect, useState} from 'react';
import {Age, GuestCircleDto, GuestDto} from '../api-client';
import NavBar from './Navbar';
import Footer from './Footer';
import {useSeatingPlanContext} from "../SeatingPlanContext.tsx";
import check from "../assets/images/check.png";
import {useNavigate} from "react-router-dom";

const AgeAliases = {
    CHILD: 'Kind',
    TEEN: 'Teenager',
    YOUNG_ADULT: 'Junger Erwachsener',
    ADULT: 'Erwachsener',
    SENIOR: 'Senior',
} as const;


const Card = ({circle, onEdit}: { circle: GuestCircleDto, onEdit: () => void }) => {
    return (
        <div
            className="bg-[rgb(97,30,38)] shadow-lg rounded-xl p-6 w-full max-w-md text-white min-h-30 min-w-60 relative group"
        >
            <div className="flex justify-between items-center">
                <p className="text-white text-lg font-semibold text-left">{circle.name}'s Gruppe</p>
                <span
                    onClick={onEdit}
                    className="cursor-pointer text-red-700 hover:text-black hover:!scale-120"
                    title="Bearbeiten"
                >
                                        ✏️
                                    </span>
            </div>
            <hr className="my-2 border-white mb-3"/>
            {circle.members?.map((member, index) => (
                <div key={index}>
                    <div className="flex justify-between">
                        <p className="text-sm">Name:</p>
                        <p className="text-sm">{member.firstName} {member.lastName}</p>
                    </div>
                    <div className="flex justify-between mt-1">
                        <p className="text-sm">Alter:</p>
                        <p className="text-sm">{AgeAliases[member.age as Age]}</p>
                    </div>
                    {member.groups && member.groups.length > 0 && (
                        <div className="flex justify-between mt-1">
                            <p className="text-sm">Gruppen:</p>
                            <p className="text-sm">{member.groups.join(', ')}</p>
                        </div>
                    )}
                    {index < (circle.members?.length ?? 0) - 1 && (
                        <hr className="my-2 border-white"/>
                    )}
                </div>
            ))}
        </div>
    );
};


export default function Guests() {
    const [guest, setGuest] = useState<GuestDto>({
        firstName: '',
        lastName: '',
        age: undefined,
        groups: [],
    });

    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    }

    const [familyMembers, setFamilyMembers] = useState<GuestDto[]>([]);
    const [availableGroups, setAvailableGroups] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [groupInput, setGroupInput] = useState('');
    const [familyGroupInputs, setFamilyGroupInputs] = useState<string[]>([]);
    const {seatingPlan, addGuestCircle} = useSeatingPlanContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setGuest((prev) => ({...prev, [name]: value}));
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGuest((prev) => ({...prev, age: e.target.value as Age}));
    };

    useEffect(() => {
        if (seatingPlan?.guestList && seatingPlan.guestList.length > 0) {
            const groupsFromPlan = seatingPlan.guestList
                .flatMap(circle => circle.members || [])
                .flatMap(member => member.groups || []);

            const uniqueGroups = Array.from(new Set(groupsFromPlan));
            setAvailableGroups(uniqueGroups);
        }
    }, [seatingPlan]);

    const isGroupUsed = (group: string, guest: GuestDto, family: GuestDto[]): boolean => {
        const allGuests = [guest, ...family];
        return allGuests.some(g => g.groups?.includes(group));
    };


    const handleFamilyMemberChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFamilyMembers((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [name]: name === 'age' ? (value as Age) : value,
            };
            return updated;
        });
    };

    const handleFamilyGroupChange = (index: number, value: string) => {
        const updatedFamilyGroupInputs = [...familyGroupInputs];
        updatedFamilyGroupInputs[index] = value;
        setFamilyGroupInputs(updatedFamilyGroupInputs);
    };

    const addFamilyMember = () => {
        setFamilyMembers((prev) => [...prev, {firstName: '', lastName: '', age: undefined, groups: []}]);
        setFamilyGroupInputs((prev) => [...prev, '']);
    };

    const addGroupToGuest = (group: string) => {
        if (!group) return;

        setGuest((prev) => {
            const updatedGroups = [...new Set([...(prev.groups || []), group])];
            return {...prev, groups: updatedGroups};
        });

        if (!availableGroups.includes(group)) {
            const updatedGroups = [...availableGroups, group];
            setAvailableGroups(updatedGroups);
            localStorage.setItem("availableGroups", JSON.stringify(updatedGroups));
        }

        setGroupInput('');
    };

    const addGroupToFamilyMember = (index: number, group: string) => {
        if (!group) return;

        setFamilyMembers((prev) => {
            const updatedFamilyMembers = [...prev];
            const updatedGroups = [...new Set([...(updatedFamilyMembers[index].groups || []), group])];
            updatedFamilyMembers[index] = {...updatedFamilyMembers[index], groups: updatedGroups};
            return updatedFamilyMembers;
        });


        setFamilyGroupInputs((prev) => {
            const updatedFamilyGroupInputs = [...prev];
            updatedFamilyGroupInputs[index] = '';  // Leert das Eingabefeld für dieses Familienmitglied
            return updatedFamilyGroupInputs;
        });
    };


    const removeGroupFromGuest = (group: string) => {
        const updatedGuest = {
            ...guest,
            groups: (guest.groups || []).filter(g => g !== group),
        };

        setGuest(updatedGuest);

        // Prüfen, ob Gruppe noch verwendet wird
        if (!isGroupUsed(group, updatedGuest, familyMembers)) {
            const updatedAvailableGroups = availableGroups.filter(g => g !== group);
            setAvailableGroups(updatedAvailableGroups);
            localStorage.setItem("availableGroups", JSON.stringify(updatedAvailableGroups));
        }
    };


    const removeGroupFromFamilyMember = (index: number, group: string) => {
        const updatedFamilyMembers = [...familyMembers];
        updatedFamilyMembers[index] = {
            ...updatedFamilyMembers[index],
            groups: (updatedFamilyMembers[index].groups || []).filter(g => g !== group),
        };

        setFamilyMembers(updatedFamilyMembers);

        // Prüfen, ob Gruppe noch verwendet wird
        if (!isGroupUsed(group, guest, updatedFamilyMembers)) {
            const updatedAvailableGroups = availableGroups.filter(g => g !== group);
            setAvailableGroups(updatedAvailableGroups);
            localStorage.setItem("availableGroups", JSON.stringify(updatedAvailableGroups));
        }
    };


    const createGuestCircle = () => {
        if (!guest.firstName?.trim() || !guest.lastName?.trim() || !guest.age) return;

        const allGuests = [guest, ...familyMembers].filter(
            (g): g is GuestDto => !!g.firstName?.trim() && !!g.lastName?.trim() && g.age !== undefined
        );

        if (allGuests.length > 0) {
            if (editIndex !== null && seatingPlan?.guestList?.[editIndex]) {
                // Ersetze den existierenden Circle
                const updatedGuestList = [...seatingPlan.guestList];
                updatedGuestList[editIndex] = {name: guest.firstName, members: allGuests};
                seatingPlan.guestList = updatedGuestList;
            } else {
                // Füge neuen Circle hinzu
                addGuestCircle(guest, familyMembers);
            }
        }

        setGuest({firstName: '', lastName: '', age: undefined, groups: []});
        setFamilyMembers([]);
        setFamilyGroupInputs([]);
        setGroupInput('');
        setEditIndex(null);
    };


    const handleEditCircle = (index: number) => {
        const circle = seatingPlan?.guestList?.[index];
        if (!circle) return;

        const [mainGuest, ...family] = circle.members || [];
        setGuest({...mainGuest});
        setFamilyMembers(family);
        setFamilyGroupInputs(family.map(() => ''));
        setEditIndex(index);
    };


    return (
        <div>
            <NavBar/>
            <button
                className="fixed top-0 left-0 -translate-y-1/2 z-999 mt-37  hover:!border-white !bg-[rgb(97,30,38)] text-white rounded-md  flex justify-center w-1/6 !text-xl ml-12 hover:!scale-102"
                onClick={switchToOverview}
            >

                Zurück
            </button>

            <div className="w-screen flex flex-col items-center mt-25">
                <div
                    className="bg-[rgb(97,30,38)] shadow-lg rounded-xl p-4 w-100 text-center text-sm flex flex-col justify-start max-w-xl">
                    <div className="flex-grow">
                        <p className="text-white text-lg">Gast hinzufügen</p>
                        <hr className="mt-2 border-white"/>

                        {/* Gast Eingabe */}
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Vorname"
                            value={guest.firstName}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-3 mb-2 border border-white rounded bg-transparent text-white placeholder-white"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Nachname"
                            value={guest.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-2 border border-white rounded bg-transparent text-white placeholder-white"
                        />
                        <select
                            name="age"
                            value={guest.age || ''}
                            onChange={handleAgeChange}
                            className="w-full h-10 px-3 mb-2 border border-white rounded bg-transparent text-white"
                        >
                            <option value="">Alter wählen</option>
                            {Object.values(Age).map((age) => (
                                <option key={age} value={age} className="text-black">
                                    {AgeAliases[age as keyof typeof AgeAliases]}
                                </option>
                            ))}
                        </select>

                        {/* Gruppe hinzufügen Abschnitt für Gast */}
                        <div className="mt-4">
                            <div className="flex items-center justify-center mb-2">
                                <p className="text-white font-semibold">Gruppe hinzufügen</p>
                            </div>
                            <div className="flex items-center justify-center mb-2">
                                <input
                                    type="text"
                                    placeholder="z.B. Dartsmannschaft"
                                    value={groupInput}
                                    onChange={(e) => setGroupInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addGroupToGuest(groupInput.trim())}
                                    className="w-full p-2 mb-2 border border-white rounded bg-transparent text-white placeholder-gray italic"
                                />
                                <button
                                    onClick={() => groupInput.trim() && addGroupToGuest(groupInput.trim())}
                                    className="ml-2 border border-red-900 hover:bg-red-900 hover:border-black rounded-md bg-white text-base text-red-900 outline-1 outline-offset-1 outline-red-900 placeholder:text-gray-400 focus:outline-3 sm:text-sm hover:scale-102"
                                >
                                    <img className="w-auto h-5 object-contain" src={check} alt="Check"/>
                                </button>
                            </div>
                        </div>

                        {/* Gruppen auswählen */}
                        <select
                            onChange={(e) => addGroupToGuest(e.target.value)}
                            className="w-full h-10 px-3 mb-2 border border-white rounded bg-transparent text-white"
                        >
                            <option value="">Gruppe auswählen</option>
                            {availableGroups.map((group, idx) => (
                                <option key={idx} value={group} className="text-black">{group}</option>
                            ))}
                        </select>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {guest.groups?.map((g, i) => (
                                <div key={i} className="flex items-center bg-white text-red-900 px-2 py-1 rounded">
                                    <span className="mr-1">{g}</span>
                                    <span
                                        onClick={() => removeGroupFromGuest(g)}
                                        className="cursor-pointer text-red-700 hover:text-black hover:!scale-120"
                                        title="Gruppe entfernen"
                                    >
                                        🗑️
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Familienmitglieder */}
                        {familyMembers.map((member, index) => (
                            <div key={index} className="border-t border-white pt-4 mt-4">
                                <h3 className="mb-2 text-white">Familienmitglied {index + 1}</h3>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Vorname"
                                    value={member.firstName}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="w-full p-2 mb-2 border border-white rounded bg-transparent text-white placeholder-white"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Nachname"
                                    value={member.lastName}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="w-full p-2 mb-2 border border-white rounded bg-transparent text-white placeholder-white"
                                />
                                <select
                                    name="age"
                                    value={member.age || ''}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="w-full h-10 px-3 mb-2 border border-white rounded bg-transparent text-white"
                                >
                                    <option value="">Alter wählen</option>
                                    {Object.values(Age).map((age) => (
                                        <option key={age} value={age} className="text-black">
                                            {AgeAliases[age as keyof typeof AgeAliases]}
                                        </option>
                                    ))}
                                </select>


                                <div key={index} className="mt-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <p className="text-white font-semibold">Gruppe hinzufügen</p>
                                    </div>
                                    <div className="flex items-center justify-center mb-2">
                                        <input
                                            type="text"
                                            placeholder="z.B. Dartsmannschaft"
                                            // value={groupInput}
                                            value={familyGroupInputs[index] || ''}
                                            // onChange={(e) => setGroupInput(e.target.value)}
                                            onChange={(e) => handleFamilyGroupChange(index, e.target.value)}
                                            // onKeyDown={(e) => e.key === 'Enter' && addGroupToGuest(groupInput.trim())}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFamilyGroupChange(index, (e.target as HTMLInputElement).value)}
                                            className="w-full p-2 mb-2 border border-white rounded bg-transparent text-white placeholder-gray italic"
                                        />
                                        <button
                                            // onClick={() => groupInput.trim() && addGroupToGuest(groupInput.trim())}
                                            onClick={() => familyGroupInputs[index].trim() && addGroupToFamilyMember(index, familyGroupInputs[index].trim())}
                                            className="ml-2 border border-red-900 hover:bg-red-900 hover:border-black rounded-md bg-white text-base text-red-900 outline-1 outline-offset-1 outline-red-900 placeholder:text-gray-400 focus:outline-3 sm:text-sm hover:scale-102"
                                        >
                                            <img className="w-auto h-5 object-contain" src={check} alt="Check"/>
                                        </button>
                                    </div>
                                </div>


                                <select
                                    onChange={(e) => handleFamilyGroupChange(index, e.target.value)}
                                    className="w-full h-10 px-3 mb-2 border border-white rounded bg-transparent text-white"
                                >
                                    <option value="">Gruppe auswählen</option>
                                    {availableGroups.map((group, idx) => (
                                        <option key={idx} value={group} className="text-black">{group}</option>
                                    ))}
                                </select>


                                <div className="flex flex-wrap gap-2 mb-4">
                                    {member.groups?.map((g, i) => (
                                        <div key={i}
                                             className="flex items-center bg-white text-red-900 px-2 py-1 rounded">
                                            <span className="mr-1">{g}</span>
                                            <span
                                                onClick={() => removeGroupFromFamilyMember(index, g)}
                                                className="cursor-pointer text-red-700 hover:text-black hover:!scale-120"
                                                title="Gruppe entfernen"
                                            >
                                        🗑️
                                    </span>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        ))}

                        <button onClick={addFamilyMember} className="white-button-on-red-background">
                            Familienmitglied hinzufügen
                        </button>

                        <hr className="mb-2 border-white mt-3"/>
                        <div className="flex mt-auto">
                            <button
                                onClick={createGuestCircle}
                                className="hover:!border-black flex-1 rounded-md bg-white px-3 py-1.5 text-base text-red-900 sm:text-sm"
                            >
                                Erstellen
                            </button>
                        </div>
                    </div>
                </div>

                {/* GuestCircle Cards */}
                <div className="w-full flex flex-col justify-center mt-20 mb-30">
                    <div className="sm:mx-auto">
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {seatingPlan?.guestList?.map((circle, index) => (
                                <Card key={index} circle={circle} onEdit={() => handleEditCircle(index)}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
