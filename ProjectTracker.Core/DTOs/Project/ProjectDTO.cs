using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using ProjectTracker.Core.DTOs.Requirements;
using ProjectTracker.Core.DTOs.Risks;

namespace ProjectTracker.Core.DTOs.Project;

// Respone DTO for Project entity
public record ProjectDto(
    int Id,
    string ProjectName,
    string Description,
    DateTime CreatedDate,
    List<ProjectMemberDto> ProjectMembers,
    List<RequirementDto>? Requirements = null,
    List<RiskDto>? Risks = null,
    DateTime? ModifiedDate = null
);

// Request DTO for creating a new project - standard class with validation attributes
public record CreateProjectDto
{
    [Required]
    [MaxLength(100)]
    public required string ProjectName { get; init; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public required string Description { get; init; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public required string PMFirstName { get; init; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public required string PMLastName { get; init; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public required string PMEmail { get; init; } = string.Empty;
};
