import { httpClient } from "./client";
import type { LoginRequestDto, UserDto } from "@/types";


const API_ENDPOINTS = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout"
} as const;


export const login = async (loginRequest: LoginRequestDto): Promise<UserDto> => {
    const { data, statusText } = await httpClient.post<UserDto>(
        API_ENDPOINTS.LOGIN,
        loginRequest
    )
    console.log(statusText);
    return data;
};


export const logout = async (): Promise<UserDto> => {
    const { data, statusText } = await httpClient.post(API_ENDPOINTS.LOGOUT);
    console.log(statusText);
    return data;
}