import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { 
    getProjectById, 
    createProject, 
    getProjectsByEmail, 
    addMemberToProject, 
    addRiskToProject,
    getAllEffortLogsForProject,
    getEffortLogsSummary,
    getEffortLogReqBreakdown
} from "@/api/projects.api";
import type { CreateProjectDto, AddMemberToProjectDto, CreateRiskDto } from "@/types";


interface Props {
    email?: string | null,
    id?: number | null
};

export const useProjectsData = ({email = null, id = null}: Props = {}) => {
    
    const getProjectByIdQuery = useQuery({
        queryKey: ["projects", id],
        queryFn: () => getProjectById(id!),
        enabled: !!id
    })

    const createProjectMutation = useMutation({
        mutationFn: ({ newProject } : { newProject: CreateProjectDto }) => createProject(newProject),
        onSuccess: async () => {
            console.log("successfully created a project");
            await queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: (error: Error) => {
            console.error(`Error occured attempting to create a project: ${error}`);
            toast.error("Error occured attempting to create a project", {
                description: `${error}`,
            });
        }
    })

    // update to handle query keys in dict
    const getProjectsByEmailQuery = useQuery({
        queryKey: ["projects", email],
        queryFn: () => getProjectsByEmail(email!),
        enabled: !!email
    })

    const addMemberToProjectMutation = useMutation({
        mutationFn: ({ newMemberRequest } : { newMemberRequest: AddMemberToProjectDto}) => addMemberToProject(id!, newMemberRequest),
        onSuccess: async () => {
            console.log("successfully added a new member");
            await queryClient.invalidateQueries({ queryKey: ["projects", id] })
        },
        onError: (error: Error) => {
            console.log(`Error occured attempting to add member to project: ${error}`);
            toast.error("Error occured attempting to add member to project", {
                description: `${error}`,
            });
        }
    })

    const addRiskToProjectMutation = useMutation({
        mutationFn: ({ newRisk }: { newRisk: CreateRiskDto }) => addRiskToProject(id!, newRisk),
        onSuccess: async () => {
            console.log("successfully added a new risk");
            await queryClient.invalidateQueries({queryKey: ["projects", id]})
        },
        onError: (error: Error) => {
            console.error(`Error occured attempting to add risk to project: ${error}`)
            toast.error("Error occured attempting to add risk to project", {
                description: `${error}`
            })
        }
    })

    const getAllEffortLogsForProjectQuery = useQuery({
        queryKey: ["effort-logs", "all"],
        queryFn: () => getAllEffortLogsForProject(id!),
        enabled: !!id
    })

    const getEffortLogsSummaryQuery = useQuery({
        queryKey: ["effort-logs", "summary"],
        queryFn: () => getEffortLogsSummary(id!),
        enabled: !!id
    })

    const getEffortLogReqBreakdownQuery = useQuery({
        queryKey: ["effort-logs", "breakdown"],
        queryFn: () => getEffortLogReqBreakdown(id!),
        enabled: !!id
    })


    return ({
        selectedProject: getProjectByIdQuery.data,
        selectedProjectLoading: getProjectByIdQuery.isLoading,

        createProject: createProjectMutation.mutateAsync,
        creatingProject: createProjectMutation.isPending,

        linkedProjects: getProjectsByEmailQuery.data,
        linkedProjectsLoading: getProjectsByEmailQuery.isLoading,

        addMember: addMemberToProjectMutation.mutateAsync,
        addingMember: addMemberToProjectMutation.isPending,

        addRisk: addRiskToProjectMutation.mutateAsync,
        addingRisk: addRiskToProjectMutation.isPending,

        allEffortLogs: getAllEffortLogsForProjectQuery.data,
        loadingEffortLogs: getAllEffortLogsForProjectQuery.isLoading,

        effortLogsSummary: getEffortLogsSummaryQuery.data,
        loadingEffortLogsSummary: getEffortLogsSummaryQuery.isLoading,

        effortLogsReqBreakdown: getEffortLogReqBreakdownQuery.data,
        loadingEffortLogsReqBreakdown: getEffortLogReqBreakdownQuery.isLoading,
    });
};