import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChartBarIcon, BookDashedIcon, Clipboard, LogsIcon, SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectMetaData } from "@/context/ProjectContext";
import { formatProjectNameForUrl } from "@/utils/helpers";


const Sidebar = () => {
    const { projectMetaData } = useProjectMetaData();
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const formattedProjectName = formatProjectNameForUrl(projectMetaData?.projectName ?? "");
    

    return (
        <div className={`flex flex-col items-center h-[calc(100vh-72px)] ${openSidebar ? "w-22" : "w-55" }  
                            transition-[width] duration-600 ease-in-out fixed bottom-0 left-0 bg-primary/15 
                            border-r-2 rounded-r-xs`}
            >
                <span className="text-sm p-3 text-muted-foreground">Navigation</span>
                <NavLink 
                    to={`/${formattedProjectName}/general/${projectMetaData?.id}`}
                    replace
                    className={`flex flex-row w-full h-10 transition-all transition-discrete duration-400 ease-in-out 
                                ${openSidebar ? "justify-center" : "pl-5 justify-start" } items-center hover:bg-primary/25`}
                >
                    <BookDashedIcon />
                    <span 
                        className={`transition-all duration-600 ease-in-out overflow-hidden text-nowrap
                                    ${openSidebar ? "w-0 opacity-0" : "w-auto opacity-100 pl-2"}`}
                    >
                        General
                    </span>
                </NavLink>
                <NavLink 
                    to={`/${formattedProjectName}/requirements/${projectMetaData?.id}`}
                    replace
                    className={`flex flex-row w-full h-10 transition-all transition-discrete duration-400 ease-in-out 
                                ${openSidebar ? "justify-center" : "pl-5 justify-start" } items-center hover:bg-primary/25`}
                >
                    <Clipboard />
                    <span 
                        className={`transition-all duration-600 ease-in-out overflow-hidden text-nowrap
                                    ${openSidebar ? "w-0 opacity-0" : "w-auto opacity-100 pl-2"}`}
                    >
                        Requirements
                    </span>
                </NavLink>
                <NavLink 
                    to={`/${formattedProjectName}/effort-log/${projectMetaData?.id}`}
                    replace
                    className={`flex flex-row w-full h-10 transition-all transition-discrete duration-400 ease-in-out 
                                ${openSidebar ? "justify-center" : "pl-5 justify-start" } items-center hover:bg-primary/25`}
                >
                    <LogsIcon />
                    <span 
                        className={`transition-all duration-600 ease-in-out overflow-hidden text-nowrap
                                    ${openSidebar ? "w-0 opacity-0" : "w-auto opacity-100 pl-2"}`}
                    >
                        Effort Log
                    </span>
                </NavLink>
                <NavLink 
                    to={`/${formattedProjectName}/effort-summary/${projectMetaData?.id}`}
                    replace
                    className={`flex flex-row w-full h-10 transition-all transition-discrete duration-400 ease-in-out 
                                ${openSidebar ? "justify-center" : "pl-5 justify-start" } items-center hover:bg-primary/25`}
                >
                    <ChartBarIcon />
                    <span 
                        className={`transition-all duration-600 ease-in-out overflow-hidden text-nowrap
                                    ${openSidebar ? "w-0 opacity-0" : "w-auto opacity-100 pl-2"}`}
                    >
                        Effort Summary
                    </span>
                </NavLink>
                <Button
                    className="mt-auto mb-10"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenSidebar(!openSidebar)}
                >
                    <SidebarIcon/>
                </Button>
            </div>
    );
}

export default Sidebar;