// src/context/SeatingPlanContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {
    GuestCircleDto,
    GuestDto,
    SeatingplanDto,
    SeatingplanSolutionDto,
    SeatingRuleDto,
    TableDataDto
} from './api-client';
import {putSeatingplan} from './services/generateSeatingplan.ts';

// Definiere den Kontext-Typ mit seatingPlan und den zugehörigen Funktionen
interface SeatingPlanContextType {
    seatingPlan: SeatingplanDto;
    addGuestCircle: (guest: GuestDto, familyMembers: GuestDto[]) => void;
    updateGuestCircle: (index: number, guest: GuestDto, familyMembers: GuestDto[]) => void;
    addSeatingRule: (firstGuest: GuestDto, secondGuest: GuestDto, ruleType: 'FRIEND' | 'ENEMY') => void;
    updateTableData: (tableData: TableDataDto) => void;
    updateGeneralData: (name: string, weddingDate: string, bride: string, groom: string) => void;
    setSeatingPlanUUID: (uuid: string) => void;
    removeSeatingRule: (index: number) => void;
    setSeatingPlan: (plan: SeatingplanDto) => void;
    updateSolution: (solution: SeatingplanSolutionDto) => void; // 👈 NEU
}


// Erstelle den Kontext
const SeatingPlanContext = createContext<SeatingPlanContextType | null>(null);

// Custom Hook zum Verwenden des Kontexts
export const useSeatingPlanContext = () => {
    const context = useContext(SeatingPlanContext);
    if (!context) {
        throw new Error('useSeatingPlanContext must be used within a SeatingPlanProvider');
    }
    return context;
};

// Typ für die Props des Providers
interface SeatingPlanProviderProps {
    children: ReactNode;
}

const syncWithBackend = async (updatedPlan: SeatingplanDto) => {
    try {
        await putSeatingplan(updatedPlan);
    } catch (error) {
        console.error('[SeatingPlan] Fehler beim Sync mit Backend', error);
    }
};

// Der SeatingPlanProvider stellt den Kontext bereit
export const SeatingPlanProvider: React.FC<SeatingPlanProviderProps> = ({children}) => {
    const [seatingPlan, setSeatingPlan] = useState<SeatingplanDto>({
        id: '',
        name: '',
        weddingDate: '',
        bride: '',
        groom: '',
        guestList: [],
        tableData: {type: 'ROUND', seatsPerTable: 0, numberOfTables: 0},
        seatingRules: [],
    });

    // 🔍 Jede Änderung am seatingPlan loggen
    useEffect(() => {
        console.log('[SeatingPlan] updated:', seatingPlan);
    }, [seatingPlan]);

    // Funktion zum Hinzufügen eines neuen GuestCircles
    const addGuestCircle = (guest: GuestDto, familyMembers: GuestDto[]) => {
        const allGuests = [guest, ...familyMembers].filter(
            (g): g is GuestDto =>
                !!g.firstName?.trim() &&
                !!g.lastName?.trim() &&
                g.age !== undefined
        );

        if (allGuests.length > 0) {
            const newCircle: GuestCircleDto = {
                name: guest.firstName + ' ' + guest.lastName,
                members: allGuests,
            };

            setSeatingPlan(prevPlan => {
                const updated = {
                    ...prevPlan,
                    guestList: [...(prevPlan.guestList || []), newCircle],
                };
                syncWithBackend(updated);
                return updated;
            });
        }
    };

    const removeSeatingRule = (index: number) => {
        setSeatingPlan(prevPlan => {
            const updatedRules = [...(prevPlan.seatingRules || [])];
            updatedRules.splice(index, 1);
            const updated = {...prevPlan, seatingRules: updatedRules};
            syncWithBackend(updated);
            return updated;
        });
    };

    const updateSolution = (solution: SeatingplanSolutionDto) => {
        setSeatingPlan(prevPlan => {
            const updated = {
                ...prevPlan,
                solution,
            };
            syncWithBackend(updated);
            return updated;
        });
    };


    // Funktion zum Hinzufügen einer neuen Sitzregel
    const addSeatingRule = (firstGuest: GuestDto, secondGuest: GuestDto, ruleType: 'FRIEND' | 'ENEMY') => {
        const newRule: SeatingRuleDto = {
            firstGuest: {
                firstName: firstGuest.firstName,
                lastName: firstGuest.lastName,
            },
            secondGuest: {
                firstName: secondGuest.firstName,
                lastName: secondGuest.lastName,
            },
            ruleType,
        };

        setSeatingPlan(prevPlan => {
            console.log("Previous:", prevPlan);
            console.log("New Rule:", newRule);
            const updated = {
                ...prevPlan,
                seatingRules: [...(prevPlan.seatingRules || []), newRule],
            };
            console.log("Updated:", updated);
            syncWithBackend(updated);
            return updated;
        });


    };

    // Funktion zum Aktualisieren der Tischdaten
    const updateTableData = (tableData: TableDataDto) => {
        setSeatingPlan(prevPlan => {
            const updated = {
                ...prevPlan,
                tableData
            };
            syncWithBackend(updated);
            return updated; // <<< Das hier hat gefehlt!
        });
    };


    const updateGeneralData = (name: string, weddingDate: string, bride: string, groom: string) => {
        setSeatingPlan(prev => {
            const updated = {
                ...prev,
                name,
                weddingDate,
                bride,
                groom,
            };
            syncWithBackend(updated);
            return updated;
        });
    };

    // Funktion zum Aktualisieren eines bestehenden GuestCircles
    const updateGuestCircle = (index: number, guest: GuestDto, familyMembers: GuestDto[]) => {
        const allGuests = [guest, ...familyMembers].filter(
            (g): g is GuestDto =>
                !!g.firstName?.trim() &&
                !!g.lastName?.trim() &&
                g.age !== undefined
        );

        if (allGuests.length > 0) {
            const updatedCircle: GuestCircleDto = {
                name: guest.firstName + ' ' + guest.lastName,
                members: allGuests,
            };

            setSeatingPlan(prevPlan => {
                const updatedGuestList = [...(prevPlan.guestList || [])];
                updatedGuestList[index] = updatedCircle;

                const updated = {
                    ...prevPlan,
                    guestList: updatedGuestList,
                };

                syncWithBackend(updated);
                return updated;
            });
        }
    };


    // Funktion zum Setzen der UUID
    const setSeatingPlanUUID = (uuid: string) => {
        setSeatingPlan(prev => ({
            ...prev,
            id: uuid,
        }));
    };

    // Funktion zum Setzen des gesamten Sitzplans (dies ist jetzt neu)
    const setSeatingPlanContext = (plan: SeatingplanDto) => {
        setSeatingPlan(plan);
    };

    return (
        <SeatingPlanContext.Provider
            value={{
                seatingPlan,
                addGuestCircle,
                addSeatingRule,
                updateTableData,
                updateGeneralData,
                updateGuestCircle,
                setSeatingPlanUUID,
                removeSeatingRule,
                setSeatingPlan: setSeatingPlanContext,
                updateSolution, // 👈 NEU
            }}
        >
            {children}
        </SeatingPlanContext.Provider>

    );
};
