import { useAuth } from "@/context/AuthContext";
import { useProjectMetaData } from "@/context/ProjectContext";
import { useNavigate} from "react-router-dom";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import type { UserDto } from "@/types";


const Navbar = () => {
    const { user, clearAuthUser } = useAuth();
    const { clearProject } = useProjectMetaData();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthUser();
        clearProject();
        navigate("/login");
    };

    const logoUrl = "../../../ontrack_icon.svg"

    return (
        <div className="fixed top-0 z-50
                        flex items-center justify-between h-18 w-full
                        bg-primary/50 border-b-2 border-sidebar-primary"
        >
            <div className="flex flex-row items-center pl-5">
                <img className="w-10" src={logoUrl} alt="Logo" />
                <div className="pl-2 font-bold">
                    OnTrack
                </div>
            </div>
            <div className="flex flex-row pr-5">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center justify-center h-11 w-11 bg-primary/70
                                        rounded-4xl border border-sidebar-primary 
                                        text-sidebar-primary hover:bg-primary/95 hover:cursor-pointer"
                        >
                            <span>
                                {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                            </span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-45">
                        <Button
                            variant="outline"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </Button>
                    </PopoverContent>   
                </Popover>
                <div className="flex flex-col pl-2">
                    <span>{`${user?.firstName} ${user?.lastName}`}</span>
                    <span className="text-muted-foreground">{user?.emailAddress}</span>
                </div>
            </div>
        </div>
    );
}

export default Navbar;