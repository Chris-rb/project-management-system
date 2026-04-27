import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewProjectDialog from "@/features/projecthub/components/NewProjectDialog";
import { UserIcon, ClipboardList, AlertTriangleIcon, PlusIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProjectMetaData } from '@/context/ProjectContext.tsx'
import type { ProjectDto, ProjectMetaData } from "@/types";
import { Button } from "@/components/ui/button";
import { useProjectsData } from "@/features/projects/hooks/useProjectsData";
import { formatProjectNameForUrl } from "@/utils/helpers";
   
const ProjectHubPage = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const { user } = useAuth();

    const { setProject } = useProjectMetaData();
    const { linkedProjects } = useProjectsData({email: `${user?.emailAddress}`});
    const projects = linkedProjects ?? [];

    const navigate = useNavigate();

    const today: Date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    const formattedDate: string = today.toLocaleDateString("en-US", options) 

    const handleSelectProject = (project: ProjectDto) => { 
        const urlFormattedName = formatProjectNameForUrl(project.projectName);
        const projectMetaData: ProjectMetaData = {
            id: project.id,
            projectName: project.projectName,
        }

        setProject(projectMetaData)
        navigate(`/${urlFormattedName}/general/${project.id}`, {replace: true})
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const [projectsAsPM, projectsAsMember] = projects.reduce<[ProjectDto[], ProjectDto[]]>(
        (acc, project) => {
        const isPM = project.projectMembers.find(
            (projectMember) => projectMember.memberId === user?.id && projectMember.role === "ProjectManager"
        )
        if (isPM) {
            acc[0].push(project);
            return acc;
        }
        acc[1].push(project);
        return acc;
        
    }, [[], []]);

    const isThePM = (project: ProjectDto): boolean => {
        return !!project.projectMembers.find((projectMember) => projectMember.memberId === user?.id && projectMember.role === "ProjectManager");
    };

    const getAllOpenRisks = () => {
        const init = 0;
        const numOfRisks = projects.reduce((acc, project) => acc + project.risks.length, init);
        return numOfRisks;
    }


    return (
        <div className="flex flex-col gap-3 min-w-3/5 mt-28">
            <div className="flex flex-row items-end justify-between">
                <div className="flex flex-col">
                    <p className="text-muted-foreground">{formattedDate.toLocaleUpperCase()}</p>
                    <p className="text-2xl">{`Welcome, ${user?.firstName}`}</p>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>       
                        <Button className="flex items-center justify-center p-4 font-bold">
                            <PlusIcon />
                            <span className="pr-2">New Project</span>
                        </Button>
                    </DialogTrigger>
                    <NewProjectDialog closeDialog={handleClose}/>
                </Dialog>
            </div>
            {/* small project details */}
            <div className="flex flex-row justify-between mb-4">
                <div className="flex bg-popover w-75 h-20 border rounded-md items-center justify-between">
                    <span className="pl-4">Total projects</span>
                    <span className="pr-4 font-bold text-3xl text-chart-2">{projects.length}</span>
                </div>
                <div className="flex bg-popover w-75 h-20 border rounded-md items-center justify-between">
                    <span className="pl-4">As Owner</span>
                    <span className="pr-4 font-bold text-3xl text-sidebar-primary">{projectsAsPM.length}</span>
                </div>
                <div className="flex bg-popover w-75 h-20 border rounded-md items-center justify-between">
                    <span className="pl-4">Open Risks (all)</span>
                    <span className="pr-4 font-bold text-3xl text-amber-500">{getAllOpenRisks()}</span>
                </div>
            </div>
            <span className="text-sm text-muted-foreground">{`PROJECTS I MANAGE (${projectsAsPM.length})`}</span>
            <div className="grid grid-cols-3 gap-x-17 gap-y-5 mb-4">
                {
                    projectsAsPM.map((project) => {
                        return (
                            <Card 
                                className="flex justify-between max-w-75 min-h-56 p-5 border 
                                            hover:cursor-pointer hover:border-primary"
                                onClick={() => handleSelectProject(project)}
                            >
                                <CardTitle className="flex flex-row items-center">
                                    <div className="flex items-center justify-center w-10 h-10 
                                                    border border-sidebar-primary bg-primary/60
                                                    rounded-lg text-sidebar-primary"
                                    >
                                        {project.projectName[0].toUpperCase()}
                                    </div>
                                    <div className="pl-3">
                                        <span>
                                            {project.projectName.toLocaleUpperCase()}
                                        </span>
                                        <div className="flex items-center justify-center w-18 h-5 
                                                    border border-sidebar-primary bg-primary/60
                                                    rounded-sm text-sidebar-primary">
                                            <span className="text-xs">{isThePM(project) ? "Owner" : "Member"}</span>
                                        </div>
                                    </div>
                                </CardTitle>
                                <CardContent>
                                    <p className="text-muted-foreground">{project.description}</p>
                                </CardContent>
                                <CardFooter className="bg-transparent">
                                    <div className="flex flex-row gap-3">
                                        <div className="flex flex-row items-center text-muted-foreground gap-1">
                                            <UserIcon className="w-4 h-4"/>
                                            {project?.projectMembers.length}
                                        </div>
                                        <div className="flex flex-row items-center text-muted-foreground gap-1">
                                            <ClipboardList className="w-4 h-4"/>
                                            {`${project?.requirements.length} req`}
                                        </div>
                                        <div className="flex flex-row items-center text-amber-500 gap-1">
                                            <AlertTriangleIcon className="w-4 h-4"/>
                                            {`${project?.risks.length} ${project?.risks.length == 1 ? `risk` : `risks`}`}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </div>
            <span className="text-sm text-muted-foreground">{`PROJECTS I'M A PART OF (${projectsAsMember.length})`}</span>
            <div className="grid grid-cols-3 gap-x-17 gap-y-5">
                {
                    projectsAsMember.map((project) => {
                        return (
                            <Card 
                                className="flex justify-between max-w-75 min-h-56 p-5 border 
                                            hover:cursor-pointer hover:border-chart-3"
                                onClick={() => handleSelectProject(project)}
                            >
                                <CardTitle className="flex flex-row items-center">
                                    <div className="flex items-center justify-center w-10 h-10 
                                                    border border-chart-1 bg-chart-3/60
                                                    rounded-lg text-chart-1"
                                    >
                                        {project.projectName[0].toUpperCase()}
                                    </div>
                                    <div className="pl-3">
                                        <span>
                                            {project.projectName.toLocaleUpperCase()}
                                        </span>
                                        <div className="flex items-center justify-center w-18 h-5 
                                                    border border-chart-1 bg-chart-3/50
                                                    rounded-sm text-chart-1">
                                            <span className="text-xs">{isThePM(project) ? "Owner" : "Member"}</span>
                                        </div>
                                    </div>
                                </CardTitle>
                                <CardContent>
                                    <p className="text-muted-foreground">{project.description}</p>
                                </CardContent>
                                <CardFooter className="bg-transparent">
                                    <div className="flex flex-row gap-3">
                                        <div className="flex flex-row items-center text-muted-foreground gap-1">
                                            <UserIcon className="w-4 h-4"/>
                                            {project?.projectMembers.length}
                                        </div>
                                        <div className="flex flex-row items-center text-muted-foreground gap-1">
                                            <ClipboardList className="w-4 h-4"/>
                                            {`${project?.requirements.length} req`}
                                        </div>
                                        <div className="flex flex-row items-center text-amber-500 gap-1">
                                            <AlertTriangleIcon className="w-4 h-4"/>
                                            {`${project?.risks.length} ${project?.risks.length == 1 ? `risk` : `risks`}`}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ProjectHubPage;