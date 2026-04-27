using Microsoft.EntityFrameworkCore;
using ProjectTracker.Core.Models;

namespace ProjectTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<User> Users => Set<User>();
    public DbSet<ProjectAssignment> ProjectAssignments => Set<ProjectAssignment>();
    public DbSet<Requirement> Requirements => Set<Requirement>();
    public DbSet<Risk> Risks => Set<Risk>();
    public DbSet<EffortLog> EffortLogs => Set<EffortLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectAssignment>().HasKey(pa => new { pa.ProjectId, pa.MemberId });

        // Project -> ProjectAssignment
        modelBuilder
            .Entity<ProjectAssignment>()
            .HasOne(pa => pa.Project)
            .WithMany(p => p.ProjectAssignments)
            .HasForeignKey(pa => pa.ProjectId);

        // User -> ProjectAssignment
        modelBuilder
            .Entity<ProjectAssignment>()
            .HasOne(pa => pa.User)
            .WithMany(u => u.ProjectAssignments)
            .HasForeignKey(pa => pa.MemberId);

        // Store enums as string for readability in the DB
        modelBuilder.Entity<ProjectAssignment>().Property(pa => pa.Role).HasConversion<string>();

        modelBuilder.Entity<Risk>().Property(r => r.Status).HasConversion<string>();

        modelBuilder.Entity<Requirement>().Property(r => r.Type).HasConversion<string>();

        modelBuilder.Entity<EffortLog>(entity =>
        {
            entity.Property(e => e.RequirementsAnalysisHours).HasPrecision(6, 2);
            entity.Property(e => e.DesignHours).HasPrecision(6, 2);
            entity.Property(e => e.CodingHours).HasPrecision(6, 2);
            entity.Property(e => e.TestingHours).HasPrecision(6, 2);
            entity.Property(e => e.ProjectManagementHours).HasPrecision(6, 2);
        });

        base.OnModelCreating(modelBuilder);
    }
}
