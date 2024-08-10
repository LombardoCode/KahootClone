using API.Interfaces;

namespace API.Data.Server.KahootCreator
{
  public class QuestionClient
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public QuizQuestionLayoutTypes Layout { get; set; }
    public TimeLimits TimeLimit { get; set; }
    public PointsMultiplier PointsMultiplier { get; set; }
    public string MediaUrl { get; set; }
    public List<AnswerClient> Answers { get; set; }
  }
}
