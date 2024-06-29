using System.Security.Claims;
using API.Data;
using API.DTOs.Kahoot;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [ApiController]
  [Route("/api/[controller]")]
  public class KahootController : ControllerBase
  {
    private readonly DataContext _dbContext;
    private readonly UserService _userService;

    public KahootController(DataContext dbContext, UserService userService)
    {
      _dbContext = dbContext;
      _userService = userService;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult> CreateKahoot(CreateKahootQuizDTO data)
    {
      var userId = await _userService.GetUserId();

      Kahoot newKahootQuiz = new Kahoot
      {
        UserId = userId,
        Title = data.NewKahootName,
        Description = null,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now
      };

      _dbContext.Add(newKahootQuiz);

      try
      {
        await _dbContext.SaveChangesAsync();
        
        return Ok(new {
          NewKahootId = newKahootQuiz.Id
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500);
      }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetKahootInformation(int id)
    {
      var KahootInformation = _dbContext.Kahoots.Find(id);

      if (KahootInformation == null)
      {
        return NotFound();
      }

      return Ok(new {
        Title = KahootInformation.Title,
        Description = KahootInformation.Description
      });
    }
  }
}