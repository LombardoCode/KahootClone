namespace API.Data.ForClient.Dashboard.Kahoot
{
  public class KahootMetadataClient
  {
    public Guid KahootId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string MediaUrl { get; set; }
    public int TimesPlayed { get; set; }
    public int Participants { get; set; }
    public bool IsPlayable { get; set; }
    public OwnerInfo OwnerInfo { get; set; }
  }

  public class OwnerInfo
  {
    public string UserName { get; set; }
    public string? MediaUrl { get; set; }
    public bool IsOwnerOfThisKahoot { get; set; }
  }
}
