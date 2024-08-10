using API.DTOs.Kahoot.Creator.FormDraft;

namespace API.Models.Creator
{
  public class KahootCreatorFormDraftDTO
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public List<KahootCreatorFormQuestion> Questions { get; set; }
  }
}