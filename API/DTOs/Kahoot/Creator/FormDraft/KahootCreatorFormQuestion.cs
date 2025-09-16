using API.Interfaces;

namespace API.DTOs.Kahoot.Creator.FormDraft
{
  public class KahootCreatorFormQuestion
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public QuizQuestionLayoutTypes Layout { get; set; }
    public TimeLimits TimeLimit { get; set; }
    public PointsMultiplier PointsMultiplier { get; set; }
    public string MediaUrl { get; set; }
    public bool HideTitleUntilAnswer { get; set; }
    
    // Navigation properties
    public List<KahootCreatorFormAnswer> Answers { get; set; }
  }
}