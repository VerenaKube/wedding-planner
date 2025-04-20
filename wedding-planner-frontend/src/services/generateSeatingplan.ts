import {SeatingplanCreationRequest, SeatingplanDto, SeatingplanSolutionDto} from "../api-client";
import apiClient from "../services/api";

export async function createSeatingPlan(data: SeatingplanCreationRequest): Promise<string> {
    try {
        const response = await apiClient.createSeatingplan(data);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Hochzeiten", error);
        return "";
    }
}

export async function putSeatingplan(seatingPlanData: SeatingplanDto): Promise<void> {
    try {
        if (seatingPlanData.id != null) {
            await apiClient.updateSeatingplan(seatingPlanData.id, seatingPlanData);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Hochzeiten", error);
    }
}

export async function getSeatingPlans(): Promise<SeatingplanDto[]> {
    try {
        const response = await apiClient.getAllSeatingplans();
        if (response.data != null) {
            return response.data;
        }
        console.log(response.data)
        // Falls response.data null ist, gebe eine leere Liste zurück
        return [];
    } catch (error) {
        console.error("Fehler beim Abrufen der Hochzeiten", error);
        // Falls ein Fehler auftritt, gebe eine leere Liste zurück
        return [];
    }
}

export async function getSeatingPlanById(id: string): Promise<SeatingplanDto> {
    try {
        const response = await apiClient.getSeatingplanById(id);  // Verwende die API-Funktion, um den Sitzplan nach ID zu holen
        return response.data;  // Rückgabe des vollständigen Sitzplans
    } catch (error) {
        console.error("Fehler beim Abrufen des Sitzplans:", error);
        throw new Error("Fehler beim Abrufen des Sitzplans");
    }
}

export async function deleteSeatingplan(id: string): Promise<void> {
    try {
        await apiClient.deleteSeatingplan(id);  // Verwende die API-Funktion, um den Sitzplan nach ID zu holen
    } catch (error) {
        console.error("Fehler beim Abrufen des Sitzplans:", error);
        throw new Error("Fehler beim Abrufen des Sitzplans");
    }
}

export async function generateSeatingPlanSolution(id: string): Promise<SeatingplanSolutionDto | null> {
    try {
        // Der Endpunkt für die Sitzplanlösung wird aufgerufen
        const response = await apiClient.createSeatingplanSolution(id);

        // Wenn eine gültige Antwort mit einem Statuscode von 200 kommt, wird die Lösung zurückgegeben
        if (response.status === 201) {
            return response.data;  // Hier wird das SeatingplanSolutionDto zurückgegeben
        }

        // Falls der Statuscode 404 zurückgegeben wird, bedeutet dies, dass der Sitzplan nicht gefunden wurde
        if (response.status === 404) {
            console.warn(`Kein Sitzplan mit der ID ${id} gefunden.`);
            return null;
        }

        // Falls der Statuscode 500 zurückgegeben wird, bedeutet dies, dass die Generierung der Lösung fehlgeschlagen ist
        if (response.status === 500) {
            console.error("Fehler bei der Generierung der Sitzplanlösung.");
            return null;
        }

        // Standardmäßig geben wir null zurück, wenn der Statuscode nicht behandelt wird
        return null;
    } catch (error) {
        console.error("Fehler beim Abrufen der Sitzplanlösung:", error);
        return null;  // Rückgabe null im Fehlerfall
    }
}



