using API.Interfaces;

namespace API.Models.Creator
{
  public class Question
  {
    public int Id { get; set; }
    public Guid KahootId { get; set; }
    public string Title { get; set; }
    public QuizQuestionLayoutTypes Layout { get; set; }
    public TimeLimits TimeLimit { get; set; }
    public PointsMultiplier PointsMultiplier { get; set; }
    public string? MediaUrl { get; set; }

    // Navigation properties
    public Kahoot Kahoot { get; set; }
    public List<Answer> Answers { get; set; }
  }
}
