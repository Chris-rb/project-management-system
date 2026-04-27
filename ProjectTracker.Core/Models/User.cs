namespace ProjectTracker.Core.Models;

public class User
{
    /// <summary>
    /// User identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Fisrt name of user
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// Last name of users
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    /// email address of user
    /// </summary>
    public required string EmailAddress { get; set; }

    /// <summary>
    /// password of user
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public DateTime? ModifiedDate { get; set; }

    public ICollection<ProjectAssignment>? ProjectAssignments { get; set; } =
        new List<ProjectAssignment>();
}
