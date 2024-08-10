using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyToQuestionModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "KahootId",
                table: "Questions",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_KahootId",
                table: "Questions",
                column: "KahootId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Kahoots_KahootId",
                table: "Questions",
                column: "KahootId",
                principalTable: "Kahoots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Kahoots_KahootId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_KahootId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "KahootId",
                table: "Questions");
        }
    }
}
