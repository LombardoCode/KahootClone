namespace API.Data.ForClient.Dashboard.Kahoot
{
  public class KahootDashboardList
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public int TimesPlayed { get; set; }
    public bool IsPlayable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
  }
}
