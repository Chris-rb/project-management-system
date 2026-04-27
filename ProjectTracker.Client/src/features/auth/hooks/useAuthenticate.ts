import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { login, logout } from "@/api/auth.api";
import { createAccount } from "@/api/users.api";
import type { CreateUserDto, LoginRequestDto } from "@/types";

export const useAuthenticate = () => {

    const loginMutation = useMutation({
        mutationFn: ({loginRequest}: {loginRequest: LoginRequestDto} ) => login(loginRequest),
        onSuccess: () => {
            console.log("Successfully logged in");
        },
        onError: (error: Error) => {
            console.log(`Error occured attempting to log in: ${error}`)
            toast.error( "Error occured attempting to log in", {
                description: `${error}`,
            }
            )
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            console.log("Successfully logged out");
        },
        onError: (error: Error) => {
            console.log(`Error occured attempting to log out: ${error}`)
            toast.error( "Error occured attempting to log out", {
                description: `${error}`,
            }
            )
        }
    });

    const signUpMutation = useMutation({
        mutationFn: ({newUser} : {newUser: CreateUserDto}) => createAccount(newUser),
        onSuccess: () => {
            console.log('Successfully created an account')
        },
        onError: (error: Error) => {
            console.error(`Error occured attempting to create an account: ${error}`)
            toast.error( "Error occured attempting to create an account", {
                description: `${error}`,
            });
        }
    })


    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,

        createAccount: signUpMutation.mutateAsync,
        createAccountPending: signUpMutation.isPending,
    };
}