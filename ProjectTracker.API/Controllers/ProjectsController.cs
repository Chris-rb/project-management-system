using System.ComponentModel;
using System.Reflection.Metadata;
using System.Text.RegularExpressions;
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

namespace ProjectsTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProjectsController(AppDbContext db) => _db = db;

    // GET api/projects/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetProjectById(int id)
    {
        var project = await _db
            .Projects.Where(p => p.Id == id)
            .Include(p => p.ProjectAssignments)
                .ThenInclude(pa => pa.User)
            .Include(p => p.Risks)
            .Include(p => p.Requirements)
                .ThenInclude(r => r.EffortLogs)
            .FirstOrDefaultAsync();

        if (project is null)
            return NotFound($"No project found with Id: {id}");

        var projectDto = new ProjectDto(
            project.Id,
            project.ProjectName,
            project.Description,
            project.CreatedDate,
            project
                .ProjectAssignments.Select(pa => new ProjectMemberDto(
                    pa.ProjectId,
                    pa.MemberId,
                    pa.Role,
                    pa.IsActive,
                    pa.User.FirstName,
                    pa.User.LastName,
                    pa.User.EmailAddress,
                    pa.CreatedDate
                ))
                .ToList(),
            project
                .Requirements.Select(r => new RequirementDto(
                    r.Id,
                    r.ProjectId,
                    r.Title,
                    r.Description,
                    r.Type,
                    r.Complete,
                    r.EffortLogs.Select(ef => new EffortLogDto(
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
                            Notes: ef.Notes
                        ))
                        .ToList()
                ))
                .ToList(),
            project
                .Risks.Select(r => new RiskDto(r.Id, r.ProjectId, r.Description, r.Status))
                .ToList(),
            project.ModifiedDate
        );

        return Ok(projectDto);
    }

    // POST api/projects/new-project
    [HttpPost("new-project")]
    // need to add email to body data to lookup user to get id and pass to new PA
    public async Task<ActionResult<ProjectDto>> CreateProject(
        [FromBody] CreateProjectDto newProjectDetails
    )
    {
        // first check if user email exists or throw error
        // user.id
        var newProject = new Project
        {
            ProjectName = newProjectDetails.ProjectName,
            Description = newProjectDetails.Description,
        };

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.EmailAddress == newProjectDetails.PMEmail
        );

        if (user is null)
        {
            return NotFound(
                $"User with email {newProjectDetails.PMEmail} not found. Please provide a valid email for the project manager."
            );
        }

        _db.Projects.Add(newProject);

        // temperary
        ProjectDto project;
        try
        {
            var savedChanges = await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }

        // Move to services as a seperate method called afterwards

        // add MemberId = user.Id
        // user = user
        var newProjectAssignment = new ProjectAssignment
        {
            ProjectId = newProject.Id,
            MemberId = user.Id,
            Role = Role.ProjectManager,
            IsActive = true,
            User = user,
            Project = newProject,
        };

        // now add projectAssignment to Project list of PAs
        // check database if PA appended to Project PAs list
        newProject.ProjectAssignments.Add(newProjectAssignment);
        _db.ProjectAssignments.Add(newProjectAssignment);

        // return Ok(
        //     new ProjectDto(
        //         newProject.Id,
        //         newProject.ProjectName,
        //         newProject.Description,
        //         newProject.PMName,
        //         newProject.CreatedDate,
        //         newProject.ModifiedDate
        //     )
        // );
        // temperary until moved to services
        project = new ProjectDto(
            newProject.Id,
            newProject.ProjectName,
            newProject.Description,
            newProject.CreatedDate,
            newProject
                .ProjectAssignments.Select(pa => new ProjectMemberDto(
                    newProject.Id,
                    pa.MemberId,
                    pa.Role,
                    pa.IsActive,
                    user.FirstName,
                    user.LastName,
                    user.EmailAddress,
                    pa.CreatedDate
                ))
                .ToList()
        );

        try
        {
            var savedChanges = await _db.SaveChangesAsync();
            return Ok(project);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    // maybe change to members/projects or users/member-projects and move to users
    // GET api/projects/members/{email}
    [HttpGet("members/{email}")]
    public async Task<ActionResult<List<ProjectDto>>> GetMemberProjectsByEmail(string email)
    {
        var projects = new List<ProjectDto>();

        var projectIds = await _db
            .ProjectAssignments.Where(pa => pa.User.EmailAddress == email)
            .Select(pa => pa.ProjectId)
            .ToListAsync();

        if (projectIds is null)
        {
            return NotFound($"No projects were found for user with email: {email}");
        }

        foreach (var projectId in projectIds)
        {
            var project = await _db
                .Projects.Include(p => p.ProjectAssignments)
                    .ThenInclude(pa => pa.User)
                .Include(p => p.Risks)
                .Include(p => p.Requirements)
                    .ThenInclude(r => r.EffortLogs)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project is null)
            {
                continue; // replace with log warning
            }

            projects.Add(
                new ProjectDto(
                    project.Id,
                    project.ProjectName,
                    project.Description,
                    project.CreatedDate,
                    project
                        .ProjectAssignments.Select(pa => new ProjectMemberDto(
                            pa.ProjectId,
                            pa.MemberId,
                            pa.Role,
                            pa.IsActive,
                            pa.User.FirstName,
                            pa.User.LastName,
                            pa.User.EmailAddress,
                            pa.CreatedDate
                        ))
                        .ToList(),
                    project
                        .Requirements.Select(r => new RequirementDto(
                            r.Id,
                            r.ProjectId,
                            r.Title,
                            r.Description,
                            r.Type,
                            r.Complete,
                            r.EffortLogs.Select(ef => new EffortLogDto(
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
                                    Notes: ef.Notes
                                ))
                                .ToList()
                        ))
                        .ToList(),
                    project
                        .Risks.Select(r => new RiskDto(r.Id, r.ProjectId, r.Description, r.Status))
                        .ToList(),
                    project.ModifiedDate
                )
            );
        }

        return Ok(projects);
    }

    [HttpPost("{id}/new-member")]
    public async Task<ActionResult<string>> AddMemberToProject(
        [FromBody] AddMemberToProjectDto request
    )
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.EmailAddress == request.Email);

        if (user is null)
        {
            return NotFound($"No user found with email {request.Email}");
        }

        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId);

        if (project is null)
        {
            return NotFound($"No project found with Id {request.ProjectId}");
        }

        var newProjectAssignment = new ProjectAssignment
        {
            ProjectId = request.ProjectId,
            MemberId = user.Id,
            Role = Role.TeamMember,
            IsActive = true,
            User = user,
            Project = project,
        };

        // may also need to add to Project db at ProjectAssignments
        _db.ProjectAssignments.Add(newProjectAssignment);

        try
        {
            var savedChanges = await _db.SaveChangesAsync();
            return Ok($"Successfully added new member to {project.ProjectName}");
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    [HttpPost("{id}/new-risk")]
    public async Task<ActionResult<string>> AddRiskToProject([FromBody] CreateRiskDto newRisk)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == newRisk.ProjectId);

        if (project is null)
        {
            return NotFound($"No project found with id {newRisk.ProjectId}");
        }

        var risk = new Risk
        {
            ProjectId = newRisk.ProjectId,
            Description = newRisk.Description,
            Status = newRisk.Status,
            Project = project,
        };

        _db.Risks.Add(risk);

        try
        {
            var savedChanges = await _db.SaveChangesAsync();
            return Ok($"Successfully added a new risk to {project.ProjectName}");
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    [HttpGet("{projectId}/effort-logs")]
    public async Task<ActionResult<List<EffortLogDto>>> GetEffortLogsForProject(int projectId)
    {
        var effortLogs = await _db
            .EffortLogs.Where(ef => ef.Requirement.ProjectId == projectId)
            .ToListAsync();

        if (effortLogs is null)
        {
            return NotFound($"No project found with id {projectId}");
        }

        var effortLogsDto = effortLogs.Select(ef => new EffortLogDto(
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
                Notes: ef.Notes
            ))
            .ToList();

        return Ok(effortLogsDto);
    }

    [HttpGet("{projectId}/effort-logs-summary")]
    public async Task<ActionResult<EffortLogSummaryDto>> GetEffortLogsSummary(int projectId)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound($"No project found with id {projectId}");
        }

        var effortLogSummary = await _db
            .EffortLogs.Where(ef => ef.Requirement.ProjectId == projectId)
            .GroupBy(ef => ef.Requirement.ProjectId)
            .Select(summary => new EffortLogSummaryDto(
                projectId,
                summary.Sum(ef => ef.RequirementsAnalysisHours),
                summary.Sum(ef => ef.DesignHours),
                summary.Sum(ef => ef.CodingHours),
                summary.Sum(ef => ef.TestingHours),
                summary.Sum(ef => ef.ProjectManagementHours),
                summary.Sum(ef => ef.TotalHours)
            ))
            .FirstOrDefaultAsync();

        return Ok(effortLogSummary);
    }

    [HttpGet("{projectId}/effort-logs-breakdown")]
    public async Task<ActionResult<List<EffortLogBreakdownPerReqDto>>> GetEffortLogsBreakdown(
        int projectId
    )
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound($"No project found with id {projectId}");
        }

        var effortLogsBreakdown = await _db
            .EffortLogs.Where(ef => ef.Requirement.ProjectId == projectId)
            .GroupBy(ef => ef.RequirementId)
            .Select(reqEfforts => new EffortLogBreakdownPerReqDto(
                reqEfforts.Key,
                reqEfforts.First().Requirement.Title,
                reqEfforts.First().Requirement.Type,
                reqEfforts.Sum(ef => ef.RequirementsAnalysisHours),
                reqEfforts.Sum(ef => ef.DesignHours),
                reqEfforts.Sum(ef => ef.CodingHours),
                reqEfforts.Sum(ef => ef.TestingHours),
                reqEfforts.Sum(ef => ef.ProjectManagementHours),
                reqEfforts.Sum(ef => ef.TotalHours)
            ))
            .ToListAsync();

        return Ok(effortLogsBreakdown);
    }
}
