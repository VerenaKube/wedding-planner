import {GuestDto, TableDto} from './api-client';
import {CSSProperties, JSX} from "react";
import {useSeatingPlanContext} from "./SeatingPlanContext.tsx";

interface Props {
    table: TableDto;
}

export default function GraphicalTable({table}: Props) {
    const guests = (table.guests?.flatMap(gc => gc.members) ?? []).filter(
        (g): g is GuestDto => g !== undefined
    );

    const {seatingPlan} = useSeatingPlanContext();
    const tableShape = seatingPlan.tableData?.type; // 'ROUND' oder 'RECTANGLE'

    const isRound = tableShape === 'ROUND';

    const guestRadius = 120;

    // Dynamische Skalierung der Tischgröße basierend auf der Anzahl der Gäste
    const guestCount = guests.length;
    let tableWidth = 220;
    let tableHeight = 140;

    // Dynamische Anpassung der Tischgröße je nach Gästeanzahl
    if (guestCount <= 4) {
        tableWidth = 180;
        tableHeight = 100;
    } else if (guestCount <= 6) {
        tableWidth = 200;
        tableHeight = 120;
    } else if (guestCount <= 8) {
        tableWidth = 220;
        tableHeight = 140;
    } else {
        tableWidth = 240;
        tableHeight = 160;
    }

    // Setzt die Tischgrößen nach der Anzahl der Gäste
    const tableStyle: CSSProperties = {
        width: `${tableWidth}px`,
        height: `${tableHeight}px`,
        backgroundColor: "#ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: isRound ? "50%" : "8px",
        position: "relative",
        margin: "auto",
    };

    const guestStyleBase = "absolute w-[70px] h-[70px] bg-blue-100 rounded-full flex items-center justify-center text-center text-xs shadow-md";

    const renderGuests = () => {
        if (isRound) {
            return guests.map((guest, index) => {
                const angle = (2 * Math.PI / guests.length) * index;
                const x = guestRadius * Math.cos(angle);
                const y = guestRadius * Math.sin(angle);

                return (
                    <div
                        key={index}
                        className={guestStyleBase}
                        style={{
                            top: `calc(50% + ${y}px - 35px)`,
                            left: `calc(50% + ${x}px - 35px)`,
                        }}
                    >
                        {guest.firstName}<br/>{guest.lastName}
                    </div>
                );
            });
        } else {
            const guestSize = 70;

            let topCount = 2, bottomCount = 2, leftCount = 0, rightCount = 0;

            if (guestCount <= 4) {
                topCount = bottomCount = Math.ceil(guestCount / 2);
            } else if (guestCount <= 6) {
                topCount = bottomCount = 2;
                leftCount = rightCount = 1;
            } else if (guestCount <= 8) {
                topCount = bottomCount = 2;
                leftCount = rightCount = 2;
            } else {
                topCount = bottomCount = 3;
                leftCount = rightCount = 2;
            }

            const containerSize = 300;
            const offsetX = (containerSize - tableWidth) / 2;
            const offsetY = (containerSize - tableHeight) / 2;

            // Aufteilen der Gäste auf die Seiten
            const top = guests.slice(0, topCount);
            const rightStart = topCount;
            const bottomStart = rightStart + rightCount;
            const leftStart = bottomStart + bottomCount;

            const right = guests.slice(rightStart, bottomStart);
            const bottom = guests.slice(bottomStart, leftStart);
            const left = guests.slice(leftStart);

            const elements: JSX.Element[] = [];

            const placeGuests = (
                side: "top" | "bottom" | "left" | "right",
                arr: GuestDto[]
            ) => {
                arr.forEach((guest, i) => {
                    let style: CSSProperties = {};

                    const spacingH = (tableWidth - arr.length * guestSize) / (arr.length + 1);
                    const spacingV = (tableHeight - arr.length * guestSize) / (arr.length + 1);

                    if (side === "top") {
                        const leftPos = offsetX + spacingH * (i + 1) + guestSize * i;
                        style = {top: `${offsetY - guestSize - 5}px`, left: `${leftPos}px`};
                    } else if (side === "bottom") {
                        const leftPos = offsetX + spacingH * (i + 1) + guestSize * i;
                        style = {top: `${offsetY + tableHeight + 5}px`, left: `${leftPos}px`};
                    } else if (side === "right") {
                        const topPos = offsetY + spacingV * (i + 1) + guestSize * i;
                        style = {top: `${topPos}px`, left: `${offsetX + tableWidth + 5}px`};
                    } else if (side === "left") {
                        const topPos = offsetY + spacingV * (i + 1) + guestSize * i;
                        style = {top: `${topPos}px`, left: `${offsetX - guestSize - 5}px`};
                    }

                    elements.push(
                        <div
                            key={`${side}-${i}`}
                            className={guestStyleBase}
                            style={style}
                        >
                            {guest.firstName}<br/>{guest.lastName}
                        </div>
                    );
                });
            };

            placeGuests("top", top);
            placeGuests("right", right);
            placeGuests("bottom", bottom);
            placeGuests("left", left);

            return elements;
        }
    };

    return (
        <div className="relative w-[300px] h-[300px] mx-15 my-15">
            <div style={{
                ...tableStyle,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                Tisch {table.tableNumber}
            </div>

            {renderGuests()}
        </div>
    );
}
