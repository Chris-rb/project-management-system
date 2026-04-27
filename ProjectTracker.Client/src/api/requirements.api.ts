import { httpClient } from "./client";
import type { RequirementDto, CreateRequirementDto } from "@/types";


const API_ENDPOINTS = {
    GET_ALL_REQUIREMENTS: "/projects/{projectId}/requirements",
    ADD_NEW_REQUIREMENT: "/projects/{projectId}/requirements/new-requirement"
} as const;


export const getAllRequirements = async (id: number): Promise<RequirementDto[]> => {
    const requestUrl = `${API_ENDPOINTS.GET_ALL_REQUIREMENTS.replace("{projectId}", id.toString())}`

    const {data, status} = await httpClient.get<RequirementDto[]>(requestUrl);
    console.log(`Response Code: ${status}`);
    return data;
}

export const createNewRequirement = async (id: number, newRequirementRequest: CreateRequirementDto): Promise<string> => {
    const requestUrl = `${API_ENDPOINTS.ADD_NEW_REQUIREMENT.replace("{projectId}", id.toString())}`;

    const { data, status } = await httpClient.post<string>(requestUrl, newRequirementRequest);
    console.log(`Response Code: ${status}`);
    return data;
}