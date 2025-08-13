namespace API.DTOs.Dashboard
{
  public class SearchKahootDTO
  {
    public string Query { get; set; }
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
  }
}
