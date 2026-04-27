using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.Models;

public class Requirement
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public required RequirementType Type { get; set; }

    public required bool Complete { get; set; } = false;

    // Foreign Key
    public required int ProjectId { get; set; }

    public required Project Project { get; set; } = null!;

    public ICollection<EffortLog> EffortLogs { get; set; } = new List<EffortLog>();
}
