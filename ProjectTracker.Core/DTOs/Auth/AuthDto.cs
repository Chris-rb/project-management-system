using System.ComponentModel.DataAnnotations;

namespace ProjectTracker.Core.DTOs.Auth;

public record LoginRequestDto
{
    [Required]
    [MaxLength(200)]
    public required string Email { get; init; }

    [Required]
    [MaxLength(200)]
    public required string Password { get; init; }
}
