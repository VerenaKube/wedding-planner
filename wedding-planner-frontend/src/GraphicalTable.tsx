import {CSSProperties, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {GuestDto, TableDto} from './api-client';
import {useSeatingPlanContext} from './SeatingPlanContext.tsx';

const ItemType = 'GUEST';

const generateTemporaryId = (): string => `temp-${Math.random().toString(36).substr(2, 9)}`;

type GuestWithTempId = GuestDto & { tempId: string };

interface Props {
    table: TableDto;
}

export default function GraphicalTable({table}: Props) {
    const {seatingPlan, updateSolution} = useSeatingPlanContext();

    const [guests, setGuests] = useState<GuestWithTempId[]>(
        (table.guests?.flatMap(gc => gc.members) ?? []).map((guest) => ({
            ...guest,
            tempId: generateTemporaryId(), // Jeder Gast bekommt eine eindeutige tempId
        }))
    );

    const tableShape = seatingPlan.tableData?.type;
    const isRound = tableShape === 'ROUND';

    const guestRadius = 120;
    const guestCount = guests.length;

    let tableWidth = 220;
    let tableHeight = 140;

    if (guestCount <= 4) {
        tableWidth = 180;
        tableHeight = 100;
    } else if (guestCount <= 6) {
        tableWidth = 200;
        tableHeight = 120;
    } else if (guestCount <= 8) {
        tableWidth = 220;
        tableHeight = 160;
    } else {
        tableWidth = 240;
        tableHeight = 240;
    }

    const tableStyle: CSSProperties = {
        width: `${tableWidth}px`,
        height: `${tableHeight}px`,
        backgroundColor: '#ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: isRound ? '50%' : '8px',
        position: 'relative',
        margin: 'auto',
    };

    const guestStyleBase =
        'absolute w-[70px] h-[70px] bg-blue-100 rounded-full flex items-center justify-center text-center text-xs shadow-md cursor-move select-none';

    const moveGuest = (draggedId: string, targetId: string) => {
        if (draggedId === targetId) return;

        const draggedIndex = guests.findIndex(g => g.tempId === draggedId);
        const targetIndex = guests.findIndex(g => g.tempId === targetId);
        if (draggedIndex === -1 || targetIndex === -1) return;

        const updatedGuests = [...guests];
        const [draggedGuest] = updatedGuests.splice(draggedIndex, 1);
        updatedGuests.splice(targetIndex, 0, draggedGuest);
        setGuests(updatedGuests);

        // Update context (ohne tempId!)
        const updatedSolution = {...seatingPlan.solution};
        const tableToUpdate = updatedSolution?.tables?.find(t => t.tableNumber === table.tableNumber);
        if (tableToUpdate) {
            tableToUpdate.guests = [
                {
                    ...tableToUpdate.guests?.[0],
                    members: updatedGuests.map(({tempId, ...rest}) => rest),
                },
            ];
            updateSolution(updatedSolution);
        }


    };

    const GuestItem = ({guest}: { guest: GuestWithTempId }) => {
        const [, dragRef] = useDrag({
            type: ItemType,
            item: {type: ItemType, id: guest.tempId}, // Eine eindeutige tempId für jeden Gast
        });

        const [, dropRef] = useDrop({
            accept: ItemType,
            drop: (item: { id: string }) => moveGuest(item.id, guest.tempId),
        });

        return (
            <div
                ref={(el) => dragRef(dropRef(el))}  // Sorgt dafür, dass der Gast korrekt gezogen und abgelegt wird
                className={guestStyleBase}
                style={guestStyles.get(guest.tempId)}  // Verwendet die individuelle Position jedes Gastes
            >
                {guest.firstName}
                <br/>
                {guest.lastName}
            </div>
        );
    };

    // Dynamische Positionierung der Gäste vorbereiten
    const guestStyles: Map<string, CSSProperties> = new Map();

    if (isRound) {
        guests.forEach((guest, index) => {
            const angle = (2 * Math.PI / guests.length) * index;
            const x = guestRadius * Math.cos(angle);
            const y = guestRadius * Math.sin(angle);
            guestStyles.set(guest.tempId, {
                top: `calc(50% + ${y}px - 35px)`,
                left: `calc(50% + ${x}px - 35px)`,
            });
        });
    } else {
        const guestSize = 70;
        const sides = ['top', 'right', 'bottom', 'left'];
        const sideGuestCounts = Array(4).fill(Math.floor(guestCount / 4));
        let remainingGuests = guestCount % 4;

        for (let i = 0; remainingGuests > 0; i++) {
            sideGuestCounts[i]++;
            remainingGuests--;
        }

        const containerSize = 300;
        const offsetX = (containerSize - tableWidth) / 2;
        const offsetY = (containerSize - tableHeight) / 2;

        let guestIndex = 0;
        for (let sideIndex = 0; sideIndex < 4; sideIndex++) {
            const count = sideGuestCounts[sideIndex];
            const sideGuests = guests.slice(guestIndex, guestIndex + count);

            sideGuests.forEach((guest, i) => {
                const spacingH = (tableWidth - count * guestSize) / (count + 1);
                const spacingV = (tableHeight - count * guestSize) / (count + 1);
                let style: CSSProperties = {};

                if (sides[sideIndex] === 'top') {
                    const leftPos = offsetX + spacingH * (i + 1) + guestSize * i;
                    style = {top: `${offsetY - guestSize - 5}px`, left: `${leftPos}px`};
                } else if (sides[sideIndex] === 'bottom') {
                    const leftPos = offsetX + spacingH * (i + 1) + guestSize * i;
                    style = {top: `${offsetY + tableHeight + 5}px`, left: `${leftPos}px`};
                } else if (sides[sideIndex] === 'right') {
                    const topPos = offsetY + spacingV * (i + 1) + guestSize * i;
                    style = {top: `${topPos}px`, left: `${offsetX + tableWidth + 5}px`};
                } else if (sides[sideIndex] === 'left') {
                    const topPos = offsetY + spacingV * (i + 1) + guestSize * i;
                    style = {top: `${topPos}px`, left: `${offsetX - guestSize - 5}px`};
                }

                guestStyles.set(guest.tempId, style);
            });

            guestIndex += count;
        }
    }

    return (
        <div className="relative w-[300px] h-[300px] mx-30 my-20">
            <div
                style={{
                    ...tableStyle,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                Tisch {table.tableNumber}
            </div>

            {guests.map(guest => (
                <GuestItem key={guest.tempId} guest={guest}/>
            ))}
        </div>
    );
}
