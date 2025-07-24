namespace API.Models.Classification
{
  public class KahootCategory
  {
    public Guid KahootId { get; set; }
    public Kahoot Kahoot { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
  }
}
