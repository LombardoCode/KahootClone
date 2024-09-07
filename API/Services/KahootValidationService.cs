using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data.Server.KahootCreator;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Services
{
  public class KahootValidationService
  {
    public bool ValidateKahoot(KahootClient kahootClientObj)
    {
      // If any question doesn't have a title, the kahoot is not playable
      if (kahootClientObj.Questions.Any(q => String.IsNullOrEmpty(q.Title)))
      {
        return false;
      }

      // We will validate each question
      foreach (var question in kahootClientObj.Questions)
      {
        // If a question doesn't have text (title), the kahoot is not playable
        if (question.Answers.Any(a => String.IsNullOrEmpty(a.Text)))
        {
          return false;
        }

        // If a question doesn't have any correct answers, the kahoot is not playable
        if (!question.Answers.Any(a => a.IsCorrect))
        {
          return false;
        }
      }

      return true;
    }
  }
}
