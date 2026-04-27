namespace ProjectTracker.Core.Models;

public class EffortLog
{
    public int Id { get; set; }

    public required DateTime LogDate { get; set; }

    public required decimal RequirementsAnalysisHours { get; set; } = 0m;

    public required decimal DesignHours { get; set; } = 0m;

    public required decimal CodingHours { get; set; } = 0m;

    public required decimal TestingHours { get; set; } = 0m;

    public required decimal ProjectManagementHours { get; set; } = 0m;

    public required decimal TotalHours { get; set; } = 0m;

    public string? Notes { get; set; }

    // Foreign Key
    public required int RequirementId { get; set; }

    public required string RequirementTitle { get; set; }

    public Requirement Requirement { get; set; } = null!;
}
