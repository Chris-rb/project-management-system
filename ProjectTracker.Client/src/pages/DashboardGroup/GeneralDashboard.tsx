import { useState } from "react"
// import { useLoaderData } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RiskStatusArray } from "@/types";
import type { RiskStatus } from "@/types";
import type { AddMemberToProjectDto, CreateRiskDto } from "@/types";
import { useProjectMetaData } from "@/context/ProjectContext";
import { useProjectsData } from "@/features/projects/hooks/useProjectsData";


const GeneralDashboard = () => {
    const [memberEmail, setMemberEmail] = useState<string>("");
    const [newRiskDesc, setNewRiskDesc] = useState<string>("");
    const [newRiskStatus, setNewRiskStatus] = useState<RiskStatus | null>(null);
    
    const { projectMetaData } = useProjectMetaData();
    const {selectedProject, addMember, addRisk} = useProjectsData({id: projectMetaData?.id});

    const pmMember = selectedProject?.projectMembers.find((member) => member.role == "ProjectManager");
    const teamMembers = selectedProject?.projectMembers.filter((member) => member.role == "TeamMember");
    const pmName = `${pmMember?.firstName} ${pmMember?.lastName}`;

    const handleAddMember = async () => {
        if (projectMetaData?.id == undefined) {
            console.error("The project id is undefined")
            return;
        }

        const newMemberRequest: AddMemberToProjectDto = {
            projectId: projectMetaData?.id,
            email: memberEmail
        }

        try {
            const resp = await addMember({newMemberRequest})
            console.log(resp);
        }
        catch {
            console.error("An error occured attempting to add a memeber by email");
        }
    }

    const handleAddRisk = async () => {
        if (projectMetaData?.id == undefined) {
            console.error("The project id is undefined")
            return;
        }

        if (newRiskStatus == null) {
            console.error("A risk status was not selected");
            return;
        }

        const newRisk: CreateRiskDto = {
            projectId: projectMetaData.id,
            description: newRiskDesc,
            status: newRiskStatus
        }

        try {
            const resp = await addRisk({newRisk});
            console.log(resp);
        }
        catch {
            console.error("An error occured attempting to add a risk");
        }
    }

    return (
        <div className="max-w-255 w-full mt-28">
            <div className="flex flex-col mb-5">
                <span className="text-3xl font-bold">General</span>
                <span className="pt-2 text-muted-foreground">Project overview and key information</span>
            </div>
            <div 
                className="grid grid-cols-2 gap-5"
            >
                <div className="col-span-2 min-w-100 p-5 bg-card border border-border rounded-md">
                    <span className="text-sm text-muted-foreground">PROJECT DESCRIPTION</span>
                    <Textarea 
                        className="mt-5"
                        placeholder="Describe the software project — goals, scope, and context..."
                        value={selectedProject?.description}
                    />
                </div>
                <div className="flex flex-col col-span-1 min-w-2.5 p-5 bg-card border border-border rounded-md">
                    <span className="text-sm text-muted-foreground">PROJECT MANAGER</span>
                    <Input 
                        className="mt-5 mmin-w-100 max-w-200"
                        value={pmName}
                        disabled

                    />
                </div>
                <div className="flex flex-col col-span-1 min-w-2.5 p-5 bg-card border border-border rounded-md">
                    <span className="text-sm text-muted-foreground">{`TEAM MEMBERS (${teamMembers?.length ?? 0})`}</span>
                    <div className="flex flex-row">
                        <Input
                            className="mt-5 mr-4 mmin-w-100 max-w-200"
                            placeholder="Add team member by email..."
                            onChange={(e) => setMemberEmail(e.target.value)}
                        />
                        <Button 
                            className="w-20 self-end"
                            onClick={async () => await handleAddMember()}
                        >
                            Add
                        </Button>
                    </div>
                    <div>
                        {!!teamMembers?.length &&
                            <Table className="mt-5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>First name</TableHead>
                                        <TableHead>Last name</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        teamMembers.map((teamMember, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{teamMember.firstName}</TableCell>
                                                    <TableCell>{teamMember.firstName}</TableCell>
                                                    <TableCell>{teamMember.emailAddress}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        }
                    </div>
                </div>
                <div className="flex flex-col col-span-2 min-w-2.5 p-5 pr-7 border bg-card border-border rounded-md">
                    <span className="text-sm text-muted-foreground">{`RISK REGISTER (${selectedProject?.risks.length ?? 0})`}</span>
                    <Label 
                        className="pt-5 text-muted-foreground"
                        htmlFor="risk-desc"
                    >
                        Risk Description
                    </Label>
                    <div className="grid grid-cols-8 gap-4 mt-2.5">
                        <Input 
                            id="risk-desc"
                            className="col-span-6"
                            placeholder="Describe the risk..."
                            onChange={(e) => setNewRiskDesc(e.target.value)}
                        />
                        <Select onValueChange={(status) => setNewRiskStatus(status as RiskStatus)}>
                            <SelectTrigger className="w-full col-span-1">
                                <SelectValue 
                                    placeholder="Status"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Risk Status
                                    </SelectLabel>
                                    {RiskStatusArray.map((status, idx) => {
                                        return (
                                            <SelectItem
                                                key={idx}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button 
                            className="w-30 col-span-1"
                            onClick={async () => await handleAddRisk()}
                        >
                            Add Risk
                        </Button>
                    </div>
                    <div>
                        {!!selectedProject?.risks.length && 
                            <Table className="mt-5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Risk Description</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        selectedProject.risks.map((risk, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{risk.description}</TableCell>
                                                    <TableCell>
                                                        <Badge className="w-22.5 h-5">{risk.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default GeneralDashboard;