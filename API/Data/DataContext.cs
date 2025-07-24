using API.Models;
using API.Models.Classification;
using API.Models.Creator;
using API.Models.Play;
using API.Models.Statistics;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Kahoot> Kahoots { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<Lobby> Lobbies { get; set; }
    public DbSet<PlayedKahoots> PlayedKahoots { get; set; }
    public DbSet<KahootsPlayedByUser> KahootsPlayedByUser { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<KahootCategory> KahootCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.Entity<AppUser>()
        .HasMany(u => u.Kahoots)
        .WithOne(k => k.User)
        .HasForeignKey(k => k.UserId);

      builder.Entity<Question>()
        .HasMany(q => q.Answers)
        .WithOne(a => a.Question)
        .HasForeignKey(a => a.QuestionId);

      builder.Entity<Lobby>()
        .HasIndex(l => l.GamePIN)
        .IsUnique();

      builder.Entity<Lobby>()
        .HasOne(l => l.Kahoot)
        .WithMany(k => k.Lobbies)
        .HasForeignKey(l => l.KahootId)
        .OnDelete(DeleteBehavior.Cascade);

      // Categories
      builder.Entity<KahootCategory>()
        .HasKey(kc => new { kc.KahootId, kc.CategoryId });

      builder.Entity<KahootCategory>()
        .HasOne(kc => kc.Kahoot)
        .WithMany(k => k.KahootCategories)
        .HasForeignKey(kc => kc.KahootId);

      builder.Entity<KahootCategory>()
        .HasOne(kc => kc.Category)
        .WithMany(c => c.KahootCategories)
        .HasForeignKey(kc => kc.CategoryId);

      base.OnModelCreating(builder);
    }
  }
}