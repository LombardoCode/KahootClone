namespace API.Data.ForClient.Play
{
  public class AnswerPlayClient
  {
    public int Id { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
    public bool IsSelected { get; set; } = false;
  }
}
