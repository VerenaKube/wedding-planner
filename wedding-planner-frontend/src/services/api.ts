import {Configuration, SeatingplanApi} from "../api-client";
import axios from "axios";

const apiConfig = new Configuration({
    basePath: "http://localhost:8080/api", // Ersetze mit der URL deines Backends
});

const apiClient = new SeatingplanApi(apiConfig, undefined, axios);

export default apiClient;