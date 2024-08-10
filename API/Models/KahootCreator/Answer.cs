namespace API.Models.Creator
{
  public class Answer
  {
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }

    // Navigation properties
    public Question Question { get; set; }
  }
}
