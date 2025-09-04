namespace API.DTOs.Discover
{
  public class DiscoverKahootCardInfoDTO
  {
    public Guid KahootId { get; set; }
    public string Title { get; set; }
    public string? MediaUrl { get; set; }
    public string CreatedByUserName { get; set; }
  }
}
