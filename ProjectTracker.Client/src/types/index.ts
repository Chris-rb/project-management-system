export type Role = "Admin" | "ProjectManager" | "TeamMember";

export const RiskStatusArray = ["Open", "Identified", "Mitigated", "Occured", "Escalated", "Closed"] as const;

export type RiskStatus = typeof RiskStatusArray[number];

export const RequirementsTypeArray = ["Functional", "NonFunctional"] as const;

export type RequirementsType = typeof RequirementsTypeArray[number];

export const EffortTypeArray = ["Requirements Analysis", "Design", "Coding", "Testing", "Project Management"] as const;

export type EffortType = typeof EffortTypeArray[number];

export interface ProjectMember {
    memberId: number,
    role: Role,
    isActive: boolean,
    firstName: string,
    lastName: string,
    emailAddress: string,
    createdDate: Date
}

export interface ProjectDto {
    id: number,
    projectName: string,
    description: string,
    createdDate: Date,
    projectMembers: ProjectMember[],
    requirements: RequirementDto[],
    risks: RiskDto[],
    modifiedDate?: Date
}

export interface CreateProjectDto {
    projectName: string,
    description: string,
    pmFirstName: string,
    pmLastName: string,
    pmEmail: string,
}

export interface ProjectMetaData {
    id: number
    projectName: string
}

export interface UserDto {
    id: number,
    firstName: string,
    lastName: string,
    emailAddress: string,
}

export interface CreateUserDto {
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
}

export interface LoginRequestDto {
    email: string,
    password: string,
}

export interface RequirementDto {
    id: number,
    projectId: number,
    title: string,
    description: string,
    type: RequirementsType
    effortLog: EffortLogDto[],
    complete: boolean,
}

export interface CreateRequirementDto {
    projectId: number,
    title: string,
    description: string,
    type: RequirementsType,
    complete: boolean,
}

export interface RiskDto {
    id: number,
    projectId: number,
    description: string,
    status: RiskStatus
}

export interface CreateRiskDto {
    projectId: number
    description: string,
    status: string,
}

export interface EffortLogDto {
    id: number,
    requirementId: number,
    requirementTitle: string,
    logDate: Date,
    requirementsAnalysisHours: number,
    designHours: number,
    codingHours: number,
    testingHours: number,
    projectManagementHours: number,
    totalHours: number,
    notes?: string
}

export interface CreateEffortLogDto {
    requirementId: number,
    logDate: Date,
    requirementsAnalysisHours: number,
    designHours: number,
    codingHours: number,
    testingHours: number,
    projectManagementHours: number,
    notes?: string
}

export interface EffortLogsSummaryDto {
    projectId: number,
    totalReqAnalysisHours: number,
    totalDesignHours: number,
    totalCodingHours: number,
    totalTestingHours: number,
    totalProjMgmtHours: number,
    totalAggregatedHours: number,
}

export interface EffortLogsReqBreakdownDto {
    requirementId: number,
    requirementTitle: string,
    type: RequirementsType,
    totalReqAnalysisHours: number,
    totalDesignHours: number,
    totalCodingHours: number,
    totalTestingHours: number,
    totalProjMgmtHours: number,
    totalAggregatedHours: number
}

export interface AddMemberToProjectDto {
    email: string,
    projectId: number
}

export const mapEffortType: Record<EffortType, keyof EffortLogsSummaryDto> ={
    "Requirements Analysis": "totalReqAnalysisHours",
    "Design": "totalDesignHours",
    "Coding": "totalCodingHours",
    "Testing": "totalTestingHours",
    "Project Management": "totalProjMgmtHours"
}

export const PhaseColors: Record<EffortType, Record<string, string>> = { 
    "Requirements Analysis": { 
        text: "text-blue-500", 
        bgOpaque: "bg-blue-500/20", 
        bg: "bg-blue-500", 
        border: "border-blue-500" 
    },
    "Design": { 
        text: "text-violet-400", 
        bgOpaque: "bg-violet-400/20", 
        bg: "bg-violet-400", 
        border: "border-violet-400" 
    },
    "Coding": { 
        text: "text-emerald-400", 
        bgOpaque: "bg-emerald-400/20", 
        bg: "bg-emerald-400", 
        border: "border-emerald-400" 
    },
    "Testing": { 
        text: "text-amber-500", 
        bgOpaque: "bg-amber-500/20", 
        bg: "bg-amber-500", 
        border: "border-amber-500" 
    },
    "Project Management": { 
        text: "text-red-400", 
        bgOpaque: "bg-red-400/20", 
        bg: "bg-red-400", 
        border: "border-red-400" 
    }
};