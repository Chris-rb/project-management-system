import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { LoginRequestDto } from "@/types";
import { validatePassword } from "@/utils/helpers";
import { useAuthenticate } from "@/features/auth/hooks/useAuthenticate";
import { useAuth } from "@/context/AuthContext";


const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passIsValid, setPassIsVald] = useState<boolean>(false);
    const [loginReady, setLoginReady] = useState<boolean>(false);

    const logoUrl = "../../../ontrack_icon.svg"

    const navigate = useNavigate();
    const { login } = useAuthenticate();
    const { setAuthUser} = useAuth();

    const handleLogin = async () => {
        const loginRequest: LoginRequestDto = {
            email: email,
            password: password
        };

        try {
            const resp = await login({loginRequest})
            if (resp) {
                console.log("login resp:", resp);
                setAuthUser(resp);
                navigate('/project-hub', {replace: true}); 
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setPassIsVald(validatePassword(password));
    }, [password]);

    useEffect(() => {
        setLoginReady(
            !!email
            && passIsValid
        )
    }, [email, passIsValid]);

    return (
        <div className="flex flex-1 items-center justify-center w-full">
            <Card 
                className="w-full max-w-md">
                <CardHeader className="mb-7">
                    <CardTitle className="flex flex-row items-center">
                        <img className="w-7" src={logoUrl} alt="Logo" />
                        <span className="ml-2 font-bold">OnTrack</span>
                    </CardTitle>
                    <CardDescription>
                        Keep all of your projects on track
                    </CardDescription>
                    <CardAction>
                        <Button 
                            variant="link"
                            onClick={() => navigate("/sign-up")}
                        >
                            Sign Up
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="Email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <CardAction>
                                        <Button variant="link">Forgot your password?</Button>
                                    </CardAction>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    aria-invalid={!passIsValid && password != ""}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!loginReady}
                        onClick={() => handleLogin()}
                    >
                        Login to OnTrack
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
};

export default LoginPage