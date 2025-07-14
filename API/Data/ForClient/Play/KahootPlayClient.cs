namespace API.Data.ForClient.Play
{
  public class KahootPlayClient
  {
    public Guid KahootId { get; set; }
    public string Title { get; set; }
    public List<QuestionPlayClient> Questions { get; set; }
  }
}
