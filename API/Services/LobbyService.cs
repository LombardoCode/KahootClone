using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
  public class LobbyService
  {
    private readonly DataContext _dbContext;

    public LobbyService(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task<string> GenerateUniquePIN()
    {
      string newPIN;
      bool pinExists;

      do
      {
        newPIN = GenerateRandomPIN();
        pinExists = await _dbContext.Lobbies.AnyAsync(p => p.GamePIN == newPIN);
      }
      while(pinExists);

      return newPIN;
    }

    private string GenerateRandomPIN()
    {
      Random random = new Random();
      string GamePIN = random.Next(100000, 999999).ToString();
      return GamePIN;
    }
  }
}
