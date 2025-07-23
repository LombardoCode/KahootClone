using API.Sockets.Hubs;

namespace API.DTOs.Statistics
{
  public class PlayedKahootDTO
  {
    public Guid KahootId { get; set; }
    public Player[] Players { get; set; }
  }
}
