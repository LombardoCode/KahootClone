namespace API.Data.ClassesForSeeds.Kahoot
{
  public class KahootSeedModel
  {
    public string Title { get; set; }
    public string Description { get; set; }
    public string? MediaUrl { get; set; }
    public List<QuestionSeedModel> Questions { get; set; }
    public string Category { get; set; }
    public List<string> Subsections { get; set; }
  }
}
