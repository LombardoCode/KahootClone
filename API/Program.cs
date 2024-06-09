using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adding the controllers
builder.Services.AddControllers();

// Database
var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
var MySQLConnString = builder.Configuration.GetConnectionString("MySQLConnString");
builder.Services.AddDbContext<DataContext>(opts =>
{
  opts.UseMySql(MySQLConnString, serverVersion)
    .EnableSensitiveDataLogging()
    .EnableDetailedErrors();
});

// Adding CORS
builder.Services.AddCors(opts =>
{
  opts.AddPolicy("AllowSpecificOrigin", builder =>
  {
    builder.WithOrigins("http://localhost:3000");
    builder.AllowAnyHeader();
    builder.AllowAnyMethod();
  });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Using the CORS policy to allow our dev environment (Next.js (with port 3000)) to make server calls
app.UseCors("AllowSpecificOrigin");

// Using the controllers
app.MapControllers();

app.UseHttpsRedirection();

app.Run();
