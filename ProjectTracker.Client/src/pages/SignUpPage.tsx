import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuthenticate } from "@/features/auth/hooks/useAuthenticate";
import { useAuth } from "@/context/AuthContext";
import type { CreateUserDto } from "@/types";
import { validatePassword } from "@/utils/helpers";


const SignUpPage = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [consfirmPassword, setConfirmPassword] = useState<string>("");
    const [passIsValid, setPassIsVald] = useState<boolean>(false);
    const [confirmPassIsValid, setConfirmPassIsValid] = useState<boolean>(false);
    const [sumbitReady, setSumbitReady] = useState<boolean>(false);

    const { setAuthUser } = useAuth();
    const navigate = useNavigate();

    const handleCreateAccount = ( async () => {
        const newUser: CreateUserDto = {
            firstName: firstName,
            lastName: lastName,
            emailAddress: email,
            password: password,
        }

        try {
            const resp = await createAccount({newUser: newUser});
            if (resp) {
                setAuthUser(resp);
                navigate('/project-hub', {replace: true}); // maybe move to onsuccess but wait, maybe not and just leave on success for toast noti
            }
            console.log(resp);
        }
        catch (error) {
            console.error(error);
        }
    })

    const { createAccount, createAccountPending } = useAuthenticate();

    useEffect(() => {
        setPassIsVald(validatePassword(password))
    }, [password])

    useEffect(() => {
        setConfirmPassIsValid(password === consfirmPassword);
    }, [password, consfirmPassword])

    useEffect(() => {
        setSumbitReady(
            !!firstName
            && !!lastName
            && !!email
            && passIsValid
            && confirmPassIsValid
        )
    }, [firstName, lastName, email, passIsValid, confirmPassIsValid]);

    return (
        <div className="flex flex-1 items-center justify-center w-full">
            <Card className="w-full max-w-md">
                <CardHeader className="pb-4">
                    <CardTitle>
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Start keeping tack of your projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6 pb-2">
                            <div className="grid gap-3">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input 
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input 
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <Label htmlFor="email">Email address</Label>
                                <Input 
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password"
                                    type="password"
                                    required
                                    aria-invalid={!passIsValid && password != ""}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Label htmlFor="confrimPassword">Confirm Password</Label>
                                <Input 
                                    id="confirmPassword"
                                    type="password"
                                    aria-invalid={!confirmPassIsValid && consfirmPassword != ""}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col w-full items-center">
                        <Button 
                            className="w-full mb-3"
                            disabled={!sumbitReady}
                            onClick={() => handleCreateAccount()}
                        >
                            {createAccountPending ? <Spinner /> : "Create Account"}
                        </Button>
                        <p >
                            Already have an account? 
                            {
                                <Button 
                                    variant="link"
                                    onClick={() => navigate("/")}
                                >
                                    Sign in
                                </Button>
                            }
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUpPage;