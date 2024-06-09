using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
var MySQLConnString = builder.Configuration.GetConnectionString("MySQLConnString");
builder.Services.AddDbContext<DataContext>(opts =>
{
  opts.UseMySql(MySQLConnString, serverVersion)
    .EnableSensitiveDataLogging()
    .EnableDetailedErrors();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();
