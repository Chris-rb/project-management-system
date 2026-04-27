using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EffortLog_Requirement_RequirementId",
                table: "EffortLog");

            migrationBuilder.DropForeignKey(
                name: "FK_Requirement_Projects_ProjectId",
                table: "Requirement");

            migrationBuilder.DropForeignKey(
                name: "FK_Risk_Projects_ProjectId",
                table: "Risk");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Risk",
                table: "Risk");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Requirement",
                table: "Requirement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EffortLog",
                table: "EffortLog");

            migrationBuilder.RenameTable(
                name: "Risk",
                newName: "Risks");

            migrationBuilder.RenameTable(
                name: "Requirement",
                newName: "Requirements");

            migrationBuilder.RenameTable(
                name: "EffortLog",
                newName: "EffortLogs");

            migrationBuilder.RenameIndex(
                name: "IX_Risk_ProjectId",
                table: "Risks",
                newName: "IX_Risks_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Requirement_ProjectId",
                table: "Requirements",
                newName: "IX_Requirements_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_EffortLog_RequirementId",
                table: "EffortLogs",
                newName: "IX_EffortLogs_RequirementId");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalHours",
                table: "EffortLogs",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Risks",
                table: "Risks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Requirements",
                table: "Requirements",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EffortLogs",
                table: "EffortLogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EffortLogs_Requirements_RequirementId",
                table: "EffortLogs",
                column: "RequirementId",
                principalTable: "Requirements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requirements_Projects_ProjectId",
                table: "Requirements",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Risks_Projects_ProjectId",
                table: "Risks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EffortLogs_Requirements_RequirementId",
                table: "EffortLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Requirements_Projects_ProjectId",
                table: "Requirements");

            migrationBuilder.DropForeignKey(
                name: "FK_Risks_Projects_ProjectId",
                table: "Risks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Risks",
                table: "Risks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Requirements",
                table: "Requirements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EffortLogs",
                table: "EffortLogs");

            migrationBuilder.DropColumn(
                name: "TotalHours",
                table: "EffortLogs");

            migrationBuilder.RenameTable(
                name: "Risks",
                newName: "Risk");

            migrationBuilder.RenameTable(
                name: "Requirements",
                newName: "Requirement");

            migrationBuilder.RenameTable(
                name: "EffortLogs",
                newName: "EffortLog");

            migrationBuilder.RenameIndex(
                name: "IX_Risks_ProjectId",
                table: "Risk",
                newName: "IX_Risk_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Requirements_ProjectId",
                table: "Requirement",
                newName: "IX_Requirement_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_EffortLogs_RequirementId",
                table: "EffortLog",
                newName: "IX_EffortLog_RequirementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Risk",
                table: "Risk",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Requirement",
                table: "Requirement",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EffortLog",
                table: "EffortLog",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EffortLog_Requirement_RequirementId",
                table: "EffortLog",
                column: "RequirementId",
                principalTable: "Requirement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requirement_Projects_ProjectId",
                table: "Requirement",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Risk_Projects_ProjectId",
                table: "Risk",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
