using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.Models;

public class ProjectAssignment
{
    public int ProjectId { get; set; }

    public int MemberId { get; set; }

    public Role Role { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public Project Project { get; set; } = null!;

    public User User { get; set; } = null!;
}
