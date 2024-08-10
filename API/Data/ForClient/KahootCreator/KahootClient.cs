namespace API.Data.Server.KahootCreator
{
  public class KahootClient
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<QuestionClient> Questions { get; set; }
  }
}
