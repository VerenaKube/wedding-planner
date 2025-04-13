import {SeatingplanCreationRequest, SeatingplanDto} from "../api-client";
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
