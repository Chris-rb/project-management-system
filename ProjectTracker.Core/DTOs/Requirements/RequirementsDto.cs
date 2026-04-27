using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using ProjectTracker.Core.DTOs.EffortLogs;
using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.DTOs.Requirements;

// Response DTO for Requirement entity
public record RequirementDto(
    int Id,
    int ProjectId,
    string Title,
    string Description,
    RequirementType Type,
    bool Complete,
    List<EffortLogDto>? EffortLog = null
);

// Request DTO for creating a new requirement
public record CreateRequirementDto
{
    [Required]
    public required int ProjectId { get; init; }

    [Required]
    public required string Title { get; init; }

    [Required]
    public required string Description { get; init; }

    [Required]
    public RequirementType Type { get; init; }

    [Required]
    public bool Complete { get; init; } = false;
};
