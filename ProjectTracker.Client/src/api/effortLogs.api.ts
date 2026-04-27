import { httpClient } from "./client";
import type { EffortLogDto, CreateEffortLogDto } from "@/types";
import { parseEffortLog } from "@/utils/helpers";

const API_ENDPOINTS = {
    GET_ALL_EFFORT_LOGS: "/requirements/{requirementId}/effortlogs",
    CREATE_NEW_EFFORT_LOG: "requirements/{requirementId}/effortlogs/new-effort-log"
} as const;


export const getAllEffortLogs = async (id: number): Promise<EffortLogDto[]> => {
    const requestUrl = `${API_ENDPOINTS.CREATE_NEW_EFFORT_LOG.replace("{requirementId}", id.toString())}`;

    const { data, status } = await httpClient.get<EffortLogDto[]>(requestUrl);
    console.log(status);
    return data.map(parseEffortLog);
}

export const createNewEffortLog = async (id: number, effortLogRequest: CreateEffortLogDto): Promise<EffortLogDto> => {
    const requestUrl = `${API_ENDPOINTS.CREATE_NEW_EFFORT_LOG.replace("{requirementId}", id.toString())}`;

    const { data, status } = await httpClient.post<EffortLogDto>(requestUrl, effortLogRequest);
    console.log(status);
    return data;
}
