import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getAllRequirements, createNewRequirement } from "@/api/requirements.api";
import type { CreateRequirementDto } from "@/types";

interface Props {
    id?: number | null
}

export const useRequirementsData = ({id = null}: Props = {}) => {

    const getAllRequirementsQuery = useQuery({
        queryKey: ["requirements"],
        queryFn: () => getAllRequirements(id!),
        enabled: !!id
    })

    const createRequirementMutation = useMutation({
        mutationFn: ({ newRequirement } : { newRequirement : CreateRequirementDto}) => createNewRequirement(id!, newRequirement),
        onSuccess: async () => {
            console.log("successfully added a new requirement");
            await queryClient.invalidateQueries({queryKey: ["requirements"]});
            toast.success("successfully added a new requirement");
        },
        onError: (error: Error) => {
            console.error(`Error occured attempting to create a requirement: ${error}`);
            toast.error("Error occured attempting to create a requirement", {
                description: `${error}`,
            });
        }
    })


    return ({
        projectRequirements: getAllRequirementsQuery.data,
        loadingProjectRequirements: getAllRequirementsQuery.isLoading,

        createRequirement: createRequirementMutation.mutateAsync,
        creatingRequirement: createRequirementMutation.isPending,
    });
}