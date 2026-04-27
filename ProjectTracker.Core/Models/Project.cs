namespace ProjectTracker.Core.Models;

public class Project
{
    /// <summary>
    /// Project identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Name of the project
    /// </summary>
    public required string ProjectName { get; set; } = string.Empty;

    /// <summary>
    /// Description of the project
    /// </summary>
    public required string Description { get; set; } = string.Empty;

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date the project was modified
    /// </summary>
    public DateTime? ModifiedDate { get; set; } = null;

    public ICollection<ProjectAssignment> ProjectAssignments { get; set; } =
        new List<ProjectAssignment>();

    public ICollection<Risk> Risks { get; set; } = new List<Risk>();

    public ICollection<Requirement> Requirements { get; set; } = new List<Requirement>();
}
