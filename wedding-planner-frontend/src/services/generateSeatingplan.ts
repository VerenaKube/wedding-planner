import apiClient from "../services/api";
import {SeatingplanCreationRequest} from "../api-client";

export async function createSeatingPlan(data: SeatingplanCreationRequest) {
    try {

        const response = await apiClient.createSeatingplan();
        console.log("UUID: ", response.data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Hochzeiten", error);
    }
}