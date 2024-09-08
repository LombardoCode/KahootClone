using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CreatedUserIdPropertyAndRemovedHasStartedPropertyFromLobbyModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasStarted",
                table: "Lobbies");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Lobbies",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Lobbies_UserId",
                table: "Lobbies",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lobbies_AspNetUsers_UserId",
                table: "Lobbies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lobbies_AspNetUsers_UserId",
                table: "Lobbies");

            migrationBuilder.DropIndex(
                name: "IX_Lobbies_UserId",
                table: "Lobbies");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Lobbies");

            migrationBuilder.AddColumn<bool>(
                name: "HasStarted",
                table: "Lobbies",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
