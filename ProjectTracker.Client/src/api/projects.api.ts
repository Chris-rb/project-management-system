import { httpClient } from "./client";
import type { 
    CreateProjectDto, 
    ProjectDto,
    AddMemberToProjectDto,
    CreateRiskDto,
    EffortLogDto,
    EffortLogsSummaryDto,
    EffortLogsReqBreakdownDto
} from "@/types";
import { parseEffortLog } from "@/utils/helpers";


const API_ENDPOINTS = {
    PROJECT_BASE: "/projects",
    CREATE_PROJECT: "/projects/new-project",
    GET_PROJECTS_BY_EMAIL_BASE: "/projects/members",
    ADD_MEMBER_TO_PROJECT: "/projects/{projectId}/new-member",
    ADD_RISK_TO_PROJECT: "/projects/{projectId}/new-risk",
    GET_ALL_EFFORT_LOGS: "/projects/{projectId}/effort-logs",
    GET_EFFORT_LOGS_SUMMARY: "/projects/{projectId}/effort-logs-summary",
    GET_EFFORT_LOG_REQ_BREAKDOWN: "/projects/{projectId}/effort-logs-breakdown",
} as const


export const getProjectById = async (id: number): Promise<ProjectDto> => {
    const url = `${API_ENDPOINTS.PROJECT_BASE}/${id}`;

    const {data, status} = await httpClient.get<ProjectDto>(url);
    console.log(status);
    return data;
}

export const createProject = async (newProject: CreateProjectDto): Promise<ProjectDto> => {
    const { data, statusText } = await httpClient.post<ProjectDto>(
        API_ENDPOINTS.CREATE_PROJECT,
        newProject
    );
    console.log(statusText);
    return data;
}

export const getProjectsByEmail = async (email: string): Promise<ProjectDto[]> => {
    const encodedEmail = encodeURIComponent(email);
    const url = `${API_ENDPOINTS.GET_PROJECTS_BY_EMAIL_BASE}/${encodedEmail}`

    const { data, status } = await httpClient.get<ProjectDto[]>(url);
    console.log(`Response Code: ${status}`);
    return data;
}

export const addMemberToProject = async (id: number, newMemberRequest: AddMemberToProjectDto): Promise<string> => {
    const url = `${API_ENDPOINTS.ADD_MEMBER_TO_PROJECT.replace("{projectId}", id.toString())}`

    const {data, status} = await httpClient.post<string>(url, newMemberRequest);
    console.log(`Response Code: ${status}`);
    return data;
}

export const addRiskToProject = async (id: number, newRiskRequest: CreateRiskDto): Promise<string> => {
    const url = `${API_ENDPOINTS.ADD_RISK_TO_PROJECT.replace("{projectId}", id.toString())}`;

    const {data, status } = await httpClient.post<string>(url, newRiskRequest);
    console.log(`Response Code: ${status}`);
    return data;
}

export const getAllEffortLogsForProject = async (id: number): Promise<EffortLogDto[]> => {
    const url = `${API_ENDPOINTS.GET_ALL_EFFORT_LOGS.replace("{projectId}", id.toString())}`;

    const { data, status } = await httpClient.get<EffortLogDto[]>(url);
    console.log(`Response Code: ${status}`);
    return data.map(parseEffortLog);
}

export const getEffortLogsSummary = async (id:  number): Promise<EffortLogsSummaryDto> => {
    const url = `${API_ENDPOINTS.GET_EFFORT_LOGS_SUMMARY.replace("{projectId}", id.toString())}`;

    const { data, status } = await httpClient.get<EffortLogsSummaryDto>(url);
    console.log(`Response Code: ${status}`);
    return data;
}

export const getEffortLogReqBreakdown = async (id: number): Promise<EffortLogsReqBreakdownDto[]> => {
    const url = `${API_ENDPOINTS.GET_EFFORT_LOG_REQ_BREAKDOWN.replace("{projectId}", id.toString())}`;

    const { data, status } = await httpClient.get<EffortLogsReqBreakdownDto[]>(url);
    console.log(`Response Code: ${status}`);
    return data;
}