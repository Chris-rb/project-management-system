using System.Data.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Data;
using ProjectTracker.API.Helpers;
using ProjectTracker.Core.DTOs.Project;
using ProjectTracker.Core.DTOs.User;
using ProjectTracker.Core.Models;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    // POST api/users/create-account
    [HttpPost("create-account")]
    public async Task<ActionResult<UserDTO>> CreateAccount([FromBody] CreateUserDTO newUserDetails)
    {
        var hashedPassword = PasswordHelper.HashPassword(newUserDetails.Password);

        var newUser = new User
        {
            FirstName = newUserDetails.FirstName,
            LastName = newUserDetails.LastName,
            EmailAddress = newUserDetails.EmailAddress,
            Password = hashedPassword,
        };

        _db.Users.Add(newUser);

        try
        {
            var savedChanges = await _db.SaveChangesAsync();
            return Ok(
                new UserDTO(newUser.Id, newUser.FirstName, newUser.LastName, newUser.EmailAddress)
            );
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }
}
