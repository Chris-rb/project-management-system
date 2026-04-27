using System.ComponentModel.DataAnnotations;

namespace ProjectTracker.Core.DTOs.User;

// Response for User entity
public record UserDTO(int Id, string FirstName, string LastName, string EmailAddress);

public record CreateUserDTO
{
    [Required]
    [MaxLength(100)]
    public required string FirstName { get; init; }

    [Required]
    [MaxLength(200)]
    public required string LastName { get; init; }

    [Required]
    [MaxLength(200)]
    public required string EmailAddress { get; init; }

    [Required]
    [MaxLength(200)]
    public required string Password { get; init; }
};
