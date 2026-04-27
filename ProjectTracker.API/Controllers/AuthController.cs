using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Data;
using ProjectTracker.API.Helpers;
using ProjectTracker.Core.DTOs.Auth;
using ProjectTracker.Core.DTOs.User;
using ProjectTracker.Core.Models;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db) => _db = db;

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login([FromBody] LoginRequestDto loginRequest)
    {
        // Add helper function in another dir for hashing pass
        var user = await _db.Users.SingleOrDefaultAsync(u => u.EmailAddress == loginRequest.Email);

        if (user is null || !PasswordHelper.VerifyPassword(loginRequest.Password, user.Password))
        {
            return NotFound(
                $"User with email {loginRequest.Email} not found or password is incorrect."
            );
        }

        return new UserDTO(user.Id, user.FirstName, user.LastName, user.EmailAddress);
    }
}
