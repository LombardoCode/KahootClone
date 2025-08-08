using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
  public class KahootService
  {
    private readonly DataContext _dbContext;

    public KahootService(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    public async Task<bool> checkIfKahootExistsById(Guid id)
    {
      bool doesKahootExists = await _dbContext.Kahoots.AnyAsync(k => k.Id == id);
      return doesKahootExists;
    }

    public async Task<string> getUserIdByKahootId(Guid id)
    {
      var userId = await _dbContext.Kahoots
                              .Where(k => k.Id == id)
                              .Select(k => k.UserId)
                              .FirstOrDefaultAsync();

      return userId;
    }

    public async Task<bool> IsOwner(Guid kahootId, string userId)
    {
      var ownerId = await _dbContext.Kahoots
                      .Where(k => k.Id == kahootId)
                      .Select(k => k.UserId)
                      .FirstOrDefaultAsync();

      return ownerId == userId;
    }

    public async Task<int> GetKahootCountFromUserId(string userId)
    {
      return await _dbContext.Kahoots.CountAsync(k => k.UserId == userId);
    }
  }
}
