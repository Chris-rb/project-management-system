using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using ProjectTracker.Core.DTOs.User;
using ProjectTracker.Core.Types;

namespace ProjectTracker.Core.DTOs.Project;

// Response DTO for ProjectAssignment entity
public record ProjectMemberDto(
    int ProjectId,
    int MemberId,
    Role Role,
    bool IsActive,
    string FirstName,
    string LastName,
    string EmailAddress,
    DateTime CreatedDate
);

// Request DTO for adding a new member to a project
public record CreateProjectAssignmentDto
{
    public required int ProjectId { get; init; }

    public required string UserEmail { get; init; }

    public required Role Role { get; init; }
};

public record AddMemberToProjectDto
{
    public required int ProjectId { get; init; }

    public required string Email { get; init; }
};
