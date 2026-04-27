import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
    SelectLabel
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardIcon } from "lucide-react";
import type { CreateRequirementDto, RequirementDto, RequirementsType } from "@/types";
import { RequirementsTypeArray } from "@/types";
import { useProjectMetaData } from "@/context/ProjectContext";
import { useRequirementsData } from "@/features/requirements/hooks/useRequirementsData";


const RequirementsDashboard = () => {
    const [newRequirementTitle, setNewRequirementTitle] = useState<string>("");
    const [newRequirementDesc, setNewRequirementDesc] = useState<string>("");
    const [newRequirementType, setNewRequirementType] = useState<RequirementsType | null>(null);

    const { projectMetaData } = useProjectMetaData();
    const { projectRequirements, loadingProjectRequirements, createRequirement } = useRequirementsData({id: projectMetaData?.id});

    const [funcRequirements, nonFuncRequirements] = useMemo(() => {
        console.log(projectRequirements);
        if (projectRequirements === undefined || projectRequirements.length === 0 ) return [[], []];

        return projectRequirements.reduce<[RequirementDto[], RequirementDto[]]>((
        acc, requirement) => {
        if (requirement.type === "Functional") {
            acc[0].push(requirement);
            return acc;
        }
        acc[1].push(requirement);
        return acc;
    }, [[], []]);
    }, [projectRequirements]);

    const handleAddRequirement = async () => {
        if (projectMetaData == null) {
            console.error("The project does not have a valid id")
            return;
        }

        if (newRequirementType == null) {
            return;
        }

        const newRequirement: CreateRequirementDto = {
            projectId: projectMetaData.id,
            title: newRequirementTitle,
            description: newRequirementDesc,
            type: newRequirementType,
            complete: false
        }

        try {
            const resp = await createRequirement({newRequirement});
            console.log(resp);;
        }
        catch {
            console.error("An error occured attempting to create a requirement")
        }
    }

    return (
        <div className="max-w-255 w-full mt-28">
            <div className="flex flex-col mb-5">
                <span className="text-3xl font-bold">Requirements</span>
                <span className="pt-2 text-muted-foreground">Functional and non-functional project requirements</span>
            </div>
            <div className="flex flex-col gap-5 min-w-200 p-5 bg-card border border-border rounded-3xl">
                <div className="grid grid-cols-9">
                    <div className="flex flex-col col-span-7">
                        <Label 
                            className="text-muted-foreground pb-2"
                            htmlFor="requirement-title"
                        >
                            Title
                        </Label>
                        <Input 
                            id="requirement-title"
                            placeholder="Requirement title ..."
                            onChange={(e) => setNewRequirementTitle(e.target.value)}
                        />
                    </div>
                    <div className="pl-4 col-span-2 self-end">
                        <Select onValueChange={(type) => setNewRequirementType(type as RequirementsType)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Requirement Type
                                    </SelectLabel>
                                    {RequirementsTypeArray.map((type, idx) => {
                                        return(
                                            <SelectItem
                                                key={idx}
                                                value={type}
                                            >
                                                {type}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label
                        className="text-muted-foreground pb-2"
                        htmlFor="requirement-desc"
                    >
                        Description
                    </Label>
                    <Textarea
                        id="requirement-desc"
                        placeholder="Detailed description of the requirement"
                        onChange={(e) => setNewRequirementDesc(e.target.value)}
                    />
                </div>
                <div>
                    <Button
                        onClick={async () => await handleAddRequirement()}
                    >
                        Add Requirement
                    </Button>
                </div>
            </div>
            <div className="flex flex-row justify-between pt-7 gap-6">
                <div className="min-w-95 min-h-70 w-full p-5 bg-card border rounded-3xl">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="w-1.5 mr-2 bg-primary"/>
                            <span>Functional</span>
                        </div>
                        <Badge className="bg-primary/60 text-sidebar-primary">{funcRequirements.length}</Badge>
                    </div>
                    <div className="flex flex-col h-full justify-center items-center">
                        {loadingProjectRequirements ? null :
                        funcRequirements.length ?
                            <div className="flex flex-col gap-3 h-full max-h-100 w-full mt-3 overflow-y-auto [scrollbar-width:thin]">
                                {funcRequirements.map((req, idx) => {

                                    return (
                                        <div key={idx} className="flex flex-col w-full bg-primary/15 p-3 border rounded-xl">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-muted-foreground text-sm pt-0.5">{`#0${idx + 1}`}</span>
                                                <div className="flex flex-col">
                                                    <span>{req.title}</span>
                                                    <span className="text-muted-foreground text-sm">{req.description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div> 
                            :
                            <>
                                <ClipboardIcon />
                                <span>No non-functional requirements</span>
                            </>
                        }
                    </div>
                </div>
                <div className="min-w-95 min-h-70 w-full p-5 bg-card border rounded-3xl">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="w-1.5 mr-2 bg-primary"/>
                            <span>Non-Functional</span>
                        </div>
                        <Badge className="bg-primary/60 text-sidebar-primary">{nonFuncRequirements.length}</Badge>
                    </div>
                    <div className="flex flex-col h-full justify-center items-center">
                        {loadingProjectRequirements ? null :
                        nonFuncRequirements.length ?
                            <div className="flex flex-col gap-3 h-full max-h-100 w-full mt-3 overflow-y-auto [scrollbar-width:thin]">
                                {nonFuncRequirements.map((req, idx) => {

                                    return (
                                        <div key={idx} className="flex flex-col w-full bg-primary/15 p-3 border rounded-xl">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-muted-foreground text-sm pt-0.5">{`#0${idx + 1}`}</span>
                                                <div className="flex flex-col">
                                                    <span>{req.title}</span>
                                                    <span className="text-muted-foreground text-sm">{req.description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div> 
                            :
                            <>
                                <ClipboardIcon />
                                <span>No functional requirements</span>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequirementsDashboard;