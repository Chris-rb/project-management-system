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
            .EffortLogs.Select(ef => new EffortLogDto(
                Id: ef.Id,
                RequirementId: ef.RequirementId,
                RequirementTitle: ef.RequirementTitle,
                LogDate: ef.LogDate,
                RequirementsAnalysisHours: ef.RequirementsAnalysisHours,
                DesignHours: ef.DesignHours,
                CodingHours: ef.CodingHours,
                TestingHours: ef.TestingHours,
                ProjectManagementHours: ef.ProjectManagementHours,
                TotalHours: ef.TotalHours,
                Notes: ef?.Notes
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
                Id: newEffortLog.Id,
                RequirementId: requirementId,
                RequirementTitle: newEffortLog.RequirementTitle,
                LogDate: newEffortLog.LogDate,
                RequirementsAnalysisHours: newEffortLog.RequirementsAnalysisHours,
                DesignHours: newEffortLog.DesignHours,
                CodingHours: newEffortLog.CodingHours,
                TestingHours: newEffortLog.TestingHours,
                ProjectManagementHours: newEffortLog.ProjectManagementHours,
                TotalHours: newEffortLog.TotalHours,
                Notes: newEffortLog?.Notes
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
