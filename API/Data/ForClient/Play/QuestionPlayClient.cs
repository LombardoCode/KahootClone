using API.Interfaces;

namespace API.Data.ForClient.Play
{
  public class QuestionPlayClient
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public QuizQuestionLayoutTypes Layout { get; set; }
    public TimeLimits TimeLimit { get; set; }
    public PointsMultiplier PointsMultiplier { get; set; }
    public string MediaUrl { get; set; }
    public bool HideTitleUntilAnswer { get; set; }
    public List<AnswerPlayClient> Answers { get; set; }
  }
}
