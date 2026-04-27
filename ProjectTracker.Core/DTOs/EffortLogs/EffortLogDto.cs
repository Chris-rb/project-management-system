using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.DTOs.EffortLogs;

// Response DTO for effortLog entity
public record EffortLogDto(
    int Id,
    int RequirementId,
    string RequirementTitle,
    DateTime LogDate,
    decimal RequirementsAnalysisHours,
    decimal DesignHours,
    decimal CodingHours,
    decimal TestingHours,
    decimal ProjectManagementHours,
    decimal TotalHours,
    string? Notes = null
);

// Request DTO for creating an EffortLog
public record CreateEffortLogDto
{
    public int RequirementId { get; init; }

    [Required]
    public DateTime LogDate { get; init; } = DateTime.UtcNow;

    public decimal RequirementsAnalysisHours { get; init; }

    public decimal DesignHours { get; init; }

    public decimal CodingHours { get; init; }

    public decimal TestingHours { get; init; }

    public decimal ProjectManagementHours { get; init; }

    public string? Notes { get; init; } = null;
};

// Response DTO for Effort Log summary for a project
public record EffortLogSummaryDto(
    int ProjectId,
    decimal TotalReqAnalysisHours,
    decimal TotalDesignHours,
    decimal TotalCodingHours,
    decimal TotalTestingHours,
    decimal TotalProjMgmtHours,
    decimal TotalAggregatedHours
);

// Response DTO for Effort Log breakdown per requirement for a project
public record EffortLogBreakdownPerReqDto(
    int RequirementId,
    string RequirementTitle,
    RequirementType Type,
    decimal TotalReqAnalysisHours,
    decimal TotalDesignHours,
    decimal TotalCodingHours,
    decimal TotalTestingHours,
    decimal TotalProjMgmtHours,
    decimal TotalAggregatedHours
);
