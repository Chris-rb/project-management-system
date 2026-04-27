using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.Models;

public class Risk
{
    public int Id { get; set; }

    public required string Description { get; set; }

    public required RiskStatus Status { get; set; }

    // Foreign Key
    public required int ProjectId { get; set; }

    public required Project Project { get; set; } = null!;
}
