using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ChangeKahootModelIDToGUID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Kahoots",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KahootId",
                table: "Questions",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Kahoots",
                type: "int",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_KahootId",
                table: "Questions",
                column: "KahootId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Kahoots_KahootId",
                table: "Questions",
                column: "KahootId",
                principalTable: "Kahoots",
                principalColumn: "Id");
        }
    }
}
