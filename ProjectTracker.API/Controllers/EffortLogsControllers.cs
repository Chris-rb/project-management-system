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
[Route("api/requirements/{requirementId}/[controller]")]
public class EffortLogsController : ControllerBase
{
    private readonly AppDbContext _db;

    public EffortLogsController(AppDbContext db) => _db = db;

    [HttpGet()]
    public async Task<ActionResult<List<EffortLogDto>>> GetAll(int requirementId)
    {
        var requirement = await _db.Requirements.FirstOrDefaultAsync(r => r.Id == requirementId);

        if (requirement is null)
        {
            return NotFound($"No requirement found with id {requirementId}");
        }

        var effortLogs = requirement
            .EffortLogs.Select(el => new EffortLogDto(
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
            .ToList();

        return Ok(effortLogs);
    }

    [HttpPost("new-effort-log")]
    public async Task<ActionResult<EffortLogDto>> CreateEffortLog(
        [FromBody] CreateEffortLogDto effortLogRequest,
        int requirementId
    )
    {
        var requirement = await _db.Requirements.FirstOrDefaultAsync(r => r.Id == requirementId);

        if (requirement is null)
        {
            return NotFound($"No requirement found with id {requirementId}");
        }

        var newEffortLog = new EffortLog
        {
            RequirementId = requirementId,
            RequirementTitle = requirement.Title,
            LogDate = effortLogRequest.LogDate,
            RequirementsAnalysisHours = effortLogRequest.RequirementsAnalysisHours,
            DesignHours = effortLogRequest.DesignHours,
            CodingHours = effortLogRequest.CodingHours,
            TestingHours = effortLogRequest.TestingHours,
            ProjectManagementHours = effortLogRequest.ProjectManagementHours,
            TotalHours = SumHours(effortLogRequest),
            Notes = effortLogRequest?.Notes,
            Requirement = requirement,
        };

        _db.EffortLogs.Add(newEffortLog);

        try
        {
            var savedChanges = _db.SaveChangesAsync();

            var effortLog = new EffortLogDto(
                newEffortLog.Id,
                requirementId,
                newEffortLog.RequirementTitle,
                newEffortLog.LogDate,
                newEffortLog.RequirementsAnalysisHours,
                newEffortLog.DesignHours,
                newEffortLog.CodingHours,
                newEffortLog.TestingHours,
                newEffortLog.ProjectManagementHours,
                newEffortLog.TotalHours,
                newEffortLog?.Notes
            );

            return Ok(effortLog);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    public static decimal SumHours(CreateEffortLogDto effortLog)
    {
        return effortLog.RequirementsAnalysisHours
            + effortLog.DesignHours
            + effortLog.CodingHours
            + effortLog.TestingHours
            + effortLog.ProjectManagementHours;
    }
}
