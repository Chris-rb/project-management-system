import { Badge } from "@/components/ui/badge";
import { 
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { formatTableHours } from "@/utils/helpers";
import { useProjectMetaData } from "@/context/ProjectContext";
import { useProjectsData } from "@/features/projects/hooks/useProjectsData";
import { EffortTypeArray, mapEffortType, PhaseColors } from "@/types";
import { ChartBarIcon } from "lucide-react";


const EffortSummaryDashboard = () => {
    const { projectMetaData } = useProjectMetaData();
    const { effortLogsSummary, effortLogsReqBreakdown } = useProjectsData({id: projectMetaData?.id});

    const getPercentage = (hours: number): string => {
        if ( !hours || !effortLogsSummary?.totalAggregatedHours || effortLogsSummary.totalAggregatedHours === 0) return "0.0%";
        return `${(hours / effortLogsSummary.totalAggregatedHours * 100).toFixed(1)}%` ;
    }

    const formatHours = (hours: number | null | undefined): string => (hours ?? 0).toFixed(1);
    

    return (
        <div className="max-w-255 w-full mt-28">
            <div className="flex flex-col mb-5">
                <span className="text-3xl font-bold">Effort Summary</span>
                <span className="pt-2 text-muted-foreground">Total hours expended across all requirements and phases</span>
            </div>
            <div className="grid grid-cols-6 gap-4.5">
                {EffortTypeArray.map((type, idx) => {
                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center gap-2 col-span-1 h-35 min-w-20
                                        p-2 bg-card border border-border rounded-2xl text-nowrap"
                        >
                            <div className={`flex items-center justify-center w-8 h-8 border rounded-full ${PhaseColors[type]["bgOpaque"]}`}>
                                <div className={`w-2 h-2 border rounded-full ${PhaseColors[type]["bg"]}`} />
                            </div>
                            <span className={`text-2xl font-bold ${PhaseColors[type]["text"]}`}>{formatHours(effortLogsSummary?.[mapEffortType[type]])}</span>
                            <span className="text-muted-foreground text-sm">{type}</span>
                        </div>
                    );
                })}
                <div className="flex flex-col items-center justify-center col-span-1 h-35 min-w-20
                                p-2 bg-card border border-muted-foreground rounded-2xl">
                    <span className="text-2xl font-bold">{formatHours(effortLogsSummary?.totalAggregatedHours)}</span>
                    <span className="text-xs">Total Hours</span>
                </div>
            </div>
            {
                effortLogsSummary &&
                <div className="flex flex-col p-5 bg-card border border-border rounded-2xl mt-4">
                    <span className="text-muted-foreground">PHASE DISTRIBUTION</span>
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-muted-foreground text-nowrap text-sm min-w-50">Requirements Analysis</span>
                        <Slider 
                            className={`${PhaseColors["Requirements Analysis"]["text"]} not-only-of-type:**:data-[slot=slider-range]:bg-current max-w-160`}
                            defaultValue={[effortLogsSummary.totalReqAnalysisHours]}
                            max={effortLogsSummary.totalAggregatedHours}
                            disabled
                        />
                        <span className={`${PhaseColors["Requirements Analysis"]["text"]}`}>{`${formatHours(effortLogsSummary.totalReqAnalysisHours)}h`}</span>
                        <span className="ml-auto text-muted-foreground text-sm">{`${getPercentage(effortLogsSummary?.totalReqAnalysisHours ?? 0)}`}</span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-muted-foreground text-nowrap text-sm min-w-50">Design</span>
                        <Slider 
                            className={`${PhaseColors["Design"]["text"]} **:data-[slot=slider-range]:bg-current max-w-160`}
                            defaultValue={[effortLogsSummary.totalDesignHours]}
                            max={effortLogsSummary.totalAggregatedHours}
                            disabled
                        />
                        <span className={`${PhaseColors["Design"]["text"]} text-sm`}>{`${formatHours(effortLogsSummary.totalDesignHours)}h`}</span>
                        <span className="ml-auto text-muted-foreground text-sm">{`${getPercentage(effortLogsSummary?.totalDesignHours) ?? 0}`}</span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-muted-foreground text-nowrap text-sm min-w-50">Coding</span>
                        <Slider 
                            className={`${PhaseColors["Coding"]["text"]} **:data-[slot=slider-range]:bg-current max-w-160`}
                            defaultValue={[effortLogsSummary.totalCodingHours]}
                            max={effortLogsSummary.totalAggregatedHours}
                            disabled
                        />
                        <span className={`${PhaseColors["Coding"]["text"]} text-sm`}>{`${formatHours(effortLogsSummary.totalCodingHours)}h`}</span>
                        <span className="ml-auto text-muted-foreground text-sm">{`${getPercentage(effortLogsSummary?.totalCodingHours ?? 0)}`}</span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-muted-foreground text-nowrap text-sm min-w-50">Testing</span>
                        <Slider 
                            className={`${PhaseColors["Testing"]["text"]} **:data-[slot=slider-range]:bg-current max-w-160`}
                            defaultValue={[effortLogsSummary.totalTestingHours]}
                            max={effortLogsSummary.totalAggregatedHours}
                            disabled
                        />
                        <span className={`${PhaseColors["Testing"]["text"]} text-sm`}>{`${formatHours(effortLogsSummary.totalTestingHours)}h`}</span>
                        <span className="ml-auto text-muted-foreground text-sm">{`${getPercentage(effortLogsSummary?.totalTestingHours ?? 0)}`}</span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-muted-foreground text-nowrap text-sm min-w-50">Project Management</span>
                        <Slider 
                            className={`${PhaseColors["Project Management"]["text"]} **:data-[slot=slider-range]:bg-current max-w-160`}
                            defaultValue={[effortLogsSummary.totalProjMgmtHours]}
                            max={effortLogsSummary.totalAggregatedHours}
                            disabled
                        />
                        <span className={`${PhaseColors["Project Management"]["text"]} text-sm`}>{`${formatHours(effortLogsSummary.totalProjMgmtHours)}h`}</span>
                        <span className="ml-auto text-muted-foreground text-sm">{`${getPercentage(effortLogsSummary?.totalProjMgmtHours ?? 0)}`}</span>
                    </div>
                </div>
            }
            <div className="flex flex-col min-w-100 min-h-45 mt-4 p-4 bg-card border border-border rounded-3xl">
                <span className="place-self-start text-muted-foreground">BREAKDOWN BY REQUIREMENT</span>
                {
                    effortLogsReqBreakdown?.length ? 
                    <div className="mt-3">
                        <Table className="overflow-hidden">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-ring">REQUIREMENT</TableHead>
                                    <TableHead className="text-ring">TYPE</TableHead>
                                    <TableHead className="text-ring">ANALYSIS</TableHead>
                                    <TableHead className="text-ring">DESIGN</TableHead>
                                    <TableHead className="text-ring">CODING</TableHead>
                                    <TableHead className="text-ring">TESTING</TableHead>
                                    <TableHead className="text-ring">MGMT</TableHead>
                                    <TableHead className="text-ring">TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    effortLogsReqBreakdown.map((reqEffort, idx) => {
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell>{reqEffort.requirementTitle}</TableCell>
                                                <TableCell>
                                                    <Badge>
                                                        {reqEffort.type === "Functional" ? 'F' : 'N'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={`${PhaseColors["Requirements Analysis"]["text"]}`}>{formatTableHours(reqEffort.totalReqAnalysisHours)}</TableCell>
                                                <TableCell className={`${PhaseColors["Design"]["text"]}`}>{formatTableHours(reqEffort.totalDesignHours)}</TableCell>
                                                <TableCell className={`${PhaseColors["Coding"]["text"]}`}>{formatTableHours(reqEffort.totalCodingHours)}</TableCell>
                                                <TableCell className={`${PhaseColors["Testing"]["text"]}`}>{formatTableHours(reqEffort.totalTestingHours)}</TableCell>
                                                <TableCell className={`${PhaseColors["Project Management"]["text"]}`}>{formatTableHours(reqEffort.totalProjMgmtHours)}</TableCell>
                                                <TableCell>{formatTableHours(reqEffort.totalAggregatedHours)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                            <TableFooter className="bg-background">
                                <TableRow>
                                    <TableCell>TOTAL</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className={`${PhaseColors["Requirements Analysis"]["text"]}`}>{formatTableHours(effortLogsSummary?.totalReqAnalysisHours)}</TableCell>
                                    <TableCell className={`${PhaseColors["Design"]["text"]}`}>{formatTableHours(effortLogsSummary?.totalDesignHours)}</TableCell>
                                    <TableCell className={`${PhaseColors["Coding"]["text"]}`}>{formatTableHours(effortLogsSummary?.totalCodingHours)}</TableCell>
                                    <TableCell className={`${PhaseColors["Testing"]["text"]}`}>{formatTableHours(effortLogsSummary?.totalTestingHours)}</TableCell>
                                    <TableCell className={`${PhaseColors["Project Management"]["text"]}`}>{formatTableHours(effortLogsSummary?.totalProjMgmtHours)}</TableCell>
                                    <TableCell>{formatTableHours(effortLogsSummary?.totalAggregatedHours)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    :
                    <div className="flex flex-col justify-center items-center h-30">
                        <ChartBarIcon />
                        <span>Add requirements and log effort to see breadkdown</span>
                    </div>
                }
            </div>
        </div>
    );
}

export default EffortSummaryDashboard;