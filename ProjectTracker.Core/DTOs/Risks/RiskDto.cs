using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.DTOs.Risks;

// Response DTO
public record RiskDto(int Id, int ProjectId, string Description, RiskStatus Status);

public record CreateRiskDto
{
    public int ProjectId { get; init; }

    public required string Description { get; init; }

    public required RiskStatus Status { get; init; }
}
