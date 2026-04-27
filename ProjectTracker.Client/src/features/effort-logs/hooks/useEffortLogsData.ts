import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getAllEffortLogs, createNewEffortLog } from "@/api/effortLogs.api";
import type { CreateEffortLogDto } from "@/types";


interface Props {
    requirementId?: number | null
}

export const useEffortLogsData = ({ requirementId = null }: Props = {}) => {

    const getEffortLogsQuery = useQuery({
        queryKey: ["effort-logs", requirementId],
        queryFn: () => getAllEffortLogs,
        enabled: !!requirementId
    })

    const createEffortLogMutation = useMutation({
        mutationFn: ({ newEffortLog } : { newEffortLog: CreateEffortLogDto }) => createNewEffortLog(requirementId!, newEffortLog),
        onSuccess: async () => {
            console.log("successfully created a new effort log");
            queryClient.invalidateQueries({queryKey: ["effort-logs", "all"]});
            toast.success("successfully added a new Effort Log");
        },
        onError: (error: Error) => {
            console.error(`Error occured attempting to add effort log to requirement: ${error}`);
            toast.error("Error occured attempting to add effort log to requirement", {
                description: `${error}`,
            })
        }
    })

    return ({
        allEffortlogsForReq: getEffortLogsQuery.data,
        loadingEffortLogsforReq: getEffortLogsQuery.isLoading,

        createEffortLog: createEffortLogMutation.mutateAsync,
        creatingEffortLog: createEffortLogMutation.isPending,
    })
}