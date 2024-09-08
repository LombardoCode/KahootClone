namespace API.Models.Play
{
  public class Lobby
  {
    public int Id { get; set; }
    public int GamePIN { get; set; }
    public GameState CurrentState { get; set; } = GameState.WaitingForPlayers;
    public Guid KahootId { get; set; }
    public string UserId { get; set; }

    // Navigation properties
    public Kahoot Kahoot { get; set; }
    public AppUser User { get; set; }
  }

  public enum GameState
  {
    WaitingForPlayers,
    InProgress,
    Finished
  }
}