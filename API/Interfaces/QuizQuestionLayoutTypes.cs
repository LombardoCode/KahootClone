using System.Text.Json.Serialization;

namespace API.Interfaces
{
  [JsonConverter(typeof(JsonStringEnumConverter))] 
  public enum QuizQuestionLayoutTypes
  {
    CLASSIC,
    TRUE_OR_FALSE
  }
}
