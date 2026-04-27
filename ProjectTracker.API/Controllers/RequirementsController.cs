using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Data;
using ProjectTracker.Core.DTOs.EffortLogs;
using ProjectTracker.Core.DTOs.Project;
using ProjectTracker.Core.DTOs.Requirements;
using ProjectTracker.Core.DTOs.Risks;
using ProjectTracker.Core.DTOs.User;
using ProjectTracker.Core.Models;
using ProjectTracker.Core.Types;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/projects/{projectId}/[controller]")]
public class RequirementsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RequirementsController(AppDbContext db) => _db = db;

    [HttpGet()]
    public async Task<ActionResult<List<RequirementDto>>> GetAll(int projectId)
    {
        var project = await _db
            .Projects.Include(p => p.Requirements)
                .ThenInclude(r => r.EffortLogs)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound($"No project found with Id {projectId}");
        }

        var requirements = project
            .Requirements.Select(r => new RequirementDto(
                r.Id,
                r.ProjectId,
                r.Title,
                r.Description,
                r.Type,
                r.Complete,
                r.EffortLogs.Select(el => new EffortLogDto(
                        el.Id,
                        el.RequirementId,
                        el.RequirementTitle,
                        el.LogDate,
                        el.RequirementsAnalysisHours,
                        el.DesignHours,
                        el.CodingHours,
                        el.TestingHours,
                        el.ProjectManagementHours,
                        el.TotalHours,
                        el?.Notes
                    ))
                    .ToList()
            ))
            .ToList();

        return Ok(requirements);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RequirementDto>> GetById(int projectId, int id)
    {
        var requirement = await _db.Requirements.FirstOrDefaultAsync(r =>
            r.Id == id && r.ProjectId == projectId
        );

        if (requirement is null)
        {
            return NotFound($"No requirement found with id: {id}");
        }

        return Ok(requirement);
    }

    [HttpPost("new-requirement")]
    public async Task<ActionResult<RequirementDto>> AddRequirement(
        [FromBody] CreateRequirementDto requirementRequest
    )
    {
        var project = await _db
            .Projects.Include(p => p.Requirements)
                .ThenInclude(r => r.EffortLogs)
            .FirstOrDefaultAsync(p => p.Id == requirementRequest.ProjectId);

        if (project is null)
        {
            return NotFound($"No project found with id {requirementRequest.ProjectId}");
        }

        var newRequirement = new Requirement
        {
            Title = requirementRequest.Title,
            Description = requirementRequest.Description,
            Type = requirementRequest.Type,
            Complete = requirementRequest.Complete,
            ProjectId = requirementRequest.ProjectId,
            Project = project,
        };

        _db.Requirements.Add(newRequirement);

        try
        {
            var savedChanges = await _db.SaveChangesAsync();

            var requirement = new RequirementDto(
                newRequirement.Id,
                newRequirement.ProjectId,
                newRequirement.Title,
                newRequirement.Description,
                newRequirement.Type,
                newRequirement.Complete
            );

            return Ok(requirement);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }
}
