namespace API.Models.Classification
{
  public class Category
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string Slug { get; set; }
    public string? MediaUrl { get; set; }
    public bool IsVisible { get; set; }

    // Navigation properties
    public List<KahootCategory> KahootCategories { get; set; }
  }
}
