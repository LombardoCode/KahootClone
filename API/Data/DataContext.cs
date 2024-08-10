using API.Models;
using API.Models.Creator;
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
      
      base.OnModelCreating(builder);
    }
  }
}