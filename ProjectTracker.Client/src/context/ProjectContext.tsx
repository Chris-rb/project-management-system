import { useState, useContext, createContext, type ReactNode } from "react";
import type { ProjectMetaData } from "@/types";

interface ProjectContextType {
    projectMetaData: ProjectMetaData | null,
    setProject: (projectMetaData: ProjectMetaData) => void,
    clearProject: () => void,
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode}) => {
    const [projectMetaData, setProjectMetaData] = useState<ProjectMetaData | null>(() => {
        const storedProjectData = localStorage.getItem("project");
        return storedProjectData ? JSON.parse(storedProjectData) : null;
    });
    
    const setProject = (projectData: ProjectMetaData) => {
        setProjectMetaData(projectData);
        localStorage.setItem("project", JSON.stringify(projectData));
    }

    const clearProject = () => {
        setProjectMetaData(null);
        localStorage.removeItem("project");
    }

    return <ProjectContext.Provider value={{ projectMetaData, setProject, clearProject }}>{children}</ProjectContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectMetaData = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useAuth must be used within a ProjectProvider");
    }
    return context;
}