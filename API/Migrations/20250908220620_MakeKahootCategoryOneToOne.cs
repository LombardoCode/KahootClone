using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class MakeKahootCategoryOneToOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KahootCategories_Categories_CategoryId",
                table: "KahootCategories");
            
            migrationBuilder.DropForeignKey(
                name: "FK_KahootCategories_Kahoots_KahootId",
                table: "KahootCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_KahootCategories",
                table: "KahootCategories");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "DiscoverSubsection",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "DiscoverSubsection",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_KahootCategories",
                table: "KahootCategories",
                column: "KahootId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscoverSubsection_CategoryId",
                table: "DiscoverSubsection",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscoverSubsection_Title_CategoryId",
                table: "DiscoverSubsection",
                columns: new[] { "Title", "CategoryId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DiscoverSubsection_Categories_CategoryId",
                table: "DiscoverSubsection",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_KahootCategories_Categories_CategoryId",
                table: "KahootCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KahootCategories_Kahoots_KahootId",
                table: "KahootCategories",
                column: "KahootId",
                principalTable: "Kahoots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscoverSubsection_Categories_CategoryId",
                table: "DiscoverSubsection");

            migrationBuilder.DropForeignKey(
                name: "FK_KahootCategories_Categories_CategoryId",
                table: "KahootCategories");
            
            migrationBuilder.DropForeignKey(
                name: "FK_KahootCategories_Kahoots_KahootId",
                table: "KahootCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_KahootCategories",
                table: "KahootCategories");

            migrationBuilder.DropIndex(
                name: "IX_DiscoverSubsection_CategoryId",
                table: "DiscoverSubsection");

            migrationBuilder.DropIndex(
                name: "IX_DiscoverSubsection_Title_CategoryId",
                table: "DiscoverSubsection");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "DiscoverSubsection");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "DiscoverSubsection",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_KahootCategories",
                table: "KahootCategories",
                columns: new[] { "KahootId", "CategoryId" });

            migrationBuilder.AddForeignKey(
                name: "FK_KahootCategories_Categories_CategoryId",
                table: "KahootCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            
            migrationBuilder.AddForeignKey(
                name: "FK_KahootCategories_Kahoots_KahootId",
                table: "KahootCategories",
                column: "KahootId",
                principalTable: "Kahoots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
