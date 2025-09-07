using API.Interfaces;

namespace API.Data.ClassesForSeeds.Kahoot
{
  public class QuestionSeedModel
  {
    public string Title { get; set; }
    public string Layout { get; set; }
    public TimeLimits? TimeLimit { get; set; }
    public PointsMultiplier? PointsMultiplier { get; set; }
    public string? MediaUrl { get; set; }
    public List<AnswerSeedModel> Answers { get; set; }
  }
}
