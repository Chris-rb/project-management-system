import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectValue
} from "@/components/ui/select";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar1Icon, AlertTriangleIcon } from "lucide-react";
import { EffortTypeArray, PhaseColors } from "@/types";
import type { EffortType, CreateEffortLogDto } from "@/types";
import { formatTableHours } from "@/utils/helpers";
import { useProjectMetaData } from "@/context/ProjectContext";
import { useRequirementsData } from "@/features/requirements/hooks/useRequirementsData";
import { useEffortLogsData } from "@/features/effort-logs/hooks/useEffortLogsData";
import { useProjectsData } from "@/features/projects/hooks/useProjectsData"; 
import { toast } from "sonner";


const EffortLogDashboard = () => {
    const [effortDate, setEffortDate] = useState<Date | undefined>(undefined);
    const [requirementId, setRequirementId] = useState<number | null>(null);
    const [reqAnalysisHours, setReqAnalysisHours] = useState<number>(0);
    const [designHours, setDesignHours] = useState<number>(0);
    const [codingHours, setCodingHours] = useState<number>(0);
    const [testingHours, setTestingHours] = useState<number>(0);
    const [projMgmtHours, setProjMgmtHours] = useState<number>(0);

    const { projectMetaData } = useProjectMetaData();
    const { projectRequirements } = useRequirementsData({id: projectMetaData?.id});
    const requirements = projectRequirements ?? [];

    const { createEffortLog } = useEffortLogsData({requirementId: requirementId});
    const { allEffortLogs } = useProjectsData({id: projectMetaData?.id});

    const handleUpdateHours = (effortType: EffortType, hours: number) => {
        switch(effortType) {
            case "Requirements Analysis":
                setReqAnalysisHours(hours);
                break;
            case "Design":
                setDesignHours(hours);
                break;
            case "Coding":
                setCodingHours(hours);
                break;
            case "Testing":
                setTestingHours(hours);
                break;
            case "Project Management":
                setProjMgmtHours(hours);
        }
    }

    const handleCreateEffortLog = async () => {
        if (requirementId == null) {
            toast.error("No requirement was selected");
            return
        }

        if (effortDate == undefined) {
            toast.error("Effort log date is invalid");
            return;
        }

        const newEffortLog: CreateEffortLogDto = {
            requirementId: requirementId,
            logDate: effortDate,
            requirementsAnalysisHours: reqAnalysisHours,
            designHours: designHours,
            codingHours: codingHours,
            testingHours: testingHours,
            projectManagementHours: projMgmtHours
        }

        try {
            const resp = await createEffortLog({newEffortLog});
            console.log(resp);
        }
        catch {
            console.error("Error occured attemping to create an effort log")
        }
        
    };

    return (
        <div className="max-w-255 w-full mt-28">
            <div className="flex flex-col mb-5">
                <span className="text-3xl font-bold">Effort Log</span>
                <span className="pt-2 text-muted-foreground">Record effort hours per requirements</span>
            </div>
            <div className="flex flex-row p-4 bg-amber-800/40 border border-amber-700 text-amber-500 rounded-2xl">
                <AlertTriangleIcon />
                <span className="pl-2 mt-1">Add requirements first before logging effort.</span>
            </div>
            <div className="mt-8 p-5 min-h-100 bg-card border border-border rounded-3xl">
                <span className="text-muted-foreground">LOG EFFORT ENTRY</span>
                <div className="mt-5 grid grid-cols-15 grid-rows-3 gap-x-2.5 gap-y-9">
                    <div className="col-span-5">
                        <Label className="pb-2">
                            Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className="flex justify-between w-full text-muted-foreground"
                                    variant="outline"
                                    data-empty={!effortDate}
                                >
                                   <span>
                                        {effortDate ? effortDate.toLocaleDateString() : "Pick a date"}
                                    </span>
                                    <Calendar1Icon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <Calendar 
                                    mode="single"
                                    selected={effortDate}
                                    onSelect={(e) => setEffortDate(e)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="col-span-5">
                        <Label className="pb-2">
                            Period
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Daily" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        <SelectItem value="Daily">
                                            Daily
                                        </SelectItem>
                                        <SelectItem value="Weekly">
                                            Weekly
                                        </SelectItem>
                                    </SelectLabel>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-5">
                        <Label className="pb-2">
                            Requirement
                        </Label>
                        <Select onValueChange={(id) => setRequirementId(Number(id))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select requirement ..."/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Requirement
                                    </SelectLabel>
                                    {requirements.map((req, idx) => {
                                        
                                        return (
                                            <SelectItem
                                                key={idx}
                                                value={req.id.toString()}
                                            >
                                                {req.title}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {EffortTypeArray.map((effortType, idx) => {
                        return (
                            <div key={idx} className="col-span-3">
                                <Label className={`pb-2 ${PhaseColors[effortType as EffortType]["text"]}`}>
                                    {effortType}
                                </Label>
                                <Input 
                                    type="number"
                                    placeholder="0"
                                    onChange={(e) => handleUpdateHours(effortType, Number(e.target.value))}
                                />
                            </div>
                        );
                    })}
                    <div className="col-span-15">
                        <Label className="pb-2">
                            Notes (optional)
                        </Label>
                        <Input placeholder="Any notes for this entry ..."/>
                    </div>
                </div>
                <Button 
                    className="mt-6"
                    onClick={async () => await handleCreateEffortLog()}
                >
                    Log Entry
                </Button>
            </div>
            {!!allEffortLogs?.length && 
                <div className="mt-8 p-5 bg-card border border-border rounded-3xl">
                    <span className="text-muted-foreground">{`RECENT ENTRIES (${allEffortLogs.length})`}</span>
                    <Table className="mt-3">
                        <TableHeader className="bg-background">
                            <TableRow>
                                <TableHead className="text-muted-foreground text-sm">Date</TableHead>
                                <TableHead className="text-muted-foreground text-sm w-60" colSpan={5}>Requirement</TableHead>
                                <TableHead className="text-muted-foreground text-xs">ANALYSIS</TableHead>
                                <TableHead className="text-muted-foreground text-xs">DESIGN</TableHead>
                                <TableHead className="text-muted-foreground text-xs">CODING</TableHead>
                                <TableHead className="text-muted-foreground text-xs">TESTING</TableHead>
                                <TableHead className="text-muted-foreground text-xs">MGMT</TableHead>
                                <TableHead className="text-muted-foreground text-xs">TOTAL</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allEffortLogs.sort((a, b) => a.logDate.getTime() - b.logDate.getTime())
                                .map((eLog, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{eLog.logDate.toLocaleDateString()}</TableCell>
                                        <TableCell colSpan={5}>{eLog.requirementTitle}</TableCell>
                                        <TableCell>{formatTableHours(eLog.requirementsAnalysisHours)}</TableCell>
                                        <TableCell>{formatTableHours(eLog.designHours)}</TableCell>
                                        <TableCell>{formatTableHours(eLog.codingHours)}</TableCell>
                                        <TableCell>{formatTableHours(eLog.testingHours)}</TableCell>
                                        <TableCell>{formatTableHours(eLog.projectManagementHours)}</TableCell>
                                        <TableCell className="text-sidebar-primary">{formatTableHours(eLog.totalHours)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            }

        </div>
    );
}

export default EffortLogDashboard;