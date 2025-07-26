using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedDiscoverSectionsAndSubsections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiscoverSection",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscoverSection", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DiscoverSubsection",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DiscoverSectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscoverSubsection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiscoverSubsection_DiscoverSection_DiscoverSectionId",
                        column: x => x.DiscoverSectionId,
                        principalTable: "DiscoverSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DiscoverSubsectionKahoots",
                columns: table => new
                {
                    DiscoverSubsectionId = table.Column<int>(type: "int", nullable: false),
                    KahootId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscoverSubsectionKahoots", x => new { x.DiscoverSubsectionId, x.KahootId });
                    table.ForeignKey(
                        name: "FK_DiscoverSubsectionKahoots_DiscoverSubsection_DiscoverSubsect~",
                        column: x => x.DiscoverSubsectionId,
                        principalTable: "DiscoverSubsection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscoverSubsectionKahoots_Kahoots_KahootId",
                        column: x => x.KahootId,
                        principalTable: "Kahoots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DiscoverSubsection_DiscoverSectionId",
                table: "DiscoverSubsection",
                column: "DiscoverSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscoverSubsectionKahoots_KahootId",
                table: "DiscoverSubsectionKahoots",
                column: "KahootId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscoverSubsectionKahoots");

            migrationBuilder.DropTable(
                name: "DiscoverSubsection");

            migrationBuilder.DropTable(
                name: "DiscoverSection");
        }
    }
}
