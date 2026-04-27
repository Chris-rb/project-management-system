import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import type { CreateProjectDto } from "@/types";
import { useProjectsData } from "@/features/projects/hooks/useProjectsData";
import { useAuth } from "@/context/AuthContext";
// import { CreateProjectDto } from "@/types";


interface Props{
    closeDialog: () => void
}

const NewProjectDialog = ( { closeDialog }: Props ) => {
    const [projectName, setProjectName] = useState<string>("");
    const [projectDesc, setProjectDesc] = useState<string>("");
    const [pmFirstName, setPmFirstName] = useState<string>("");
    const [pmLastName, setPmLastName] = useState<string>("");
    const [pmEmail, setPmEmail] = useState<string>("");

    const sumbitReady: boolean = (
        !!projectName
        && !!projectDesc
        && !!pmFirstName
        && !!pmLastName
        && !!pmEmail
    );

    const { user } = useAuth();
    const { createProject, creatingProject } = useProjectsData({ email: user?.emailAddress });

    const handleCreateProject = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const newProject: CreateProjectDto = {
            projectName: projectName,
            description: projectDesc,
            pmFirstName: pmFirstName,
            pmLastName: pmLastName,
            pmEmail: pmEmail,
        }

        try {
            const resp = await createProject({ newProject });
            console.log("FFFAaAAAA", resp);
            if (resp) {
                console.log("YOOOOO", resp);
                closeDialog();
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create new project
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleCreateProject(e)}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="project-name">Project name *</Label>
                        <Input 
                            id="project-name"  
                            required 
                            placeholder="e.g. Awesome Project"
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                        <Field>
                            <Label htmlFor="project-pm-name">Project Manager Firstname *</Label>
                            <Input 
                                id="project-pm-first-name" 
                                required 
                                placeholder="John"
                                onChange={(e) => setPmFirstName(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="project-pm-name">Project Manager Lastname *</Label>
                            <Input 
                                id="project-pm-last-name" 
                                required 
                                placeholder="Doe"
                                onChange={(e) => setPmLastName(e.target.value)}
                            />
                        </Field>
                    </div>
                    <Field>
                        <Label htmlFor="project-pm-name">Project Manager Email*</Label>
                        <Input 
                            id="project-pm-email" 
                            required 
                            placeholder="example@gmail.com"
                            onChange={(e) => setPmEmail(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="project-description">Description *</Label>
                        <Textarea 
                            id="project-description"
                            required 
                            placeholder="Brief summary of the project..."
                            onChange={(e) => setProjectDesc(e.target.value)}
                        />
                    </Field>
                </FieldGroup>
                <div className="flex justify-end">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        type="submit"
                        disabled={!sumbitReady}
                    >
                        {creatingProject ? <Spinner /> : "Create Project"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}

export default NewProjectDialog