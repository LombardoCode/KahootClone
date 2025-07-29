using API.Data;
using API.Data.ForClient.Categories;
using API.DTOs.Discover;
using API.Models.Classification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class CategoryController : ControllerBase
  {
    private readonly DataContext _dbContext;

    public CategoryController(DataContext dbContext)
    {
      _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet("getCategoryBySlug")]
    public async Task<ActionResult<CategoryClient>> GetCategoryBySlug(string categorySlug)
    {
      Category categoryFromDb = await getCategoryBySlugName(categorySlug);

      if (categoryFromDb == null)
      {
        return NotFound();
      }

      CategoryClient categoryForClient = new CategoryClient
      {
        Name = categoryFromDb.Name,
        Description = categoryFromDb.Description,
        MediaUrl = categoryFromDb.MediaUrl,
        Slug = categoryFromDb.Slug
      };

      return Ok(categoryForClient);
    }

    [Authorize]
    [HttpGet("getFeaturedKahootsByCategorySlug")]
    public async Task<ActionResult> GetFeaturedKahootsByCategorySlug(string categorySlug)
    {
      Category category = await getCategoryBySlugName(categorySlug);

      if (category == null)
      {
        return NotFound();
      }

      List<DiscoverFeaturedCardInfoDTO> kahoots = await getFeaturedKahootsFromSpecificCategoryId(category.Id);

      return Ok(kahoots);
    }

    #region Private Methods

    private async Task<Category> getCategoryBySlugName(string categorySlug)
    {
      Category category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
      return category;
    }

    private async Task<List<DiscoverFeaturedCardInfoDTO>> getFeaturedKahootsFromSpecificCategoryId(int categoryId)
    {
      var query = from kahoot in _dbContext.Kahoots
                  join kahootCategory in _dbContext.KahootCategories
                    on kahoot.Id equals kahootCategory.KahootId
                  join featured in _dbContext.FeaturedKahoots
                    on kahoot.Id equals featured.KahootId
                  where kahootCategory.CategoryId == categoryId && kahoot.Id == featured.KahootId
                  select new DiscoverFeaturedCardInfoDTO
                  {
                    KahootId = kahoot.Id,
                    Title = kahoot.Title,
                    MediaUrl = kahoot.MediaUrl,
                    NumberOfQuestions = kahoot.Questions.Count()
                  };

      return await query.ToListAsync();
    }

    #endregion
  }
}
