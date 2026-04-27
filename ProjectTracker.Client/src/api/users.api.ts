import { httpClient } from "./client";
import type { CreateUserDto, UserDto } from "@/types";


const API_ENDPOINTS = {
    CREATE_ACCOUNT: "/users/create-account"
} as const;


export const createAccount = async (newUser: CreateUserDto): Promise<UserDto> => {
    const { data, status } = await httpClient.post<UserDto>(
        API_ENDPOINTS.CREATE_ACCOUNT,
        newUser
    );
    console.log(status);
    return data;
}
