using System.Text;
using API.Data;
using API.Models;
using API.Services;
using API.Sockets.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSignalR();

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
    builder.AllowCredentials();
  });
});

// Adding Microsoft Identity
builder.Services.AddIdentity<AppUser, IdentityRole>(opts =>
{
  opts.Password.RequireDigit = true;
  opts.Password.RequiredLength = 4;
  opts.Password.RequireNonAlphanumeric = false;
  opts.Password.RequireLowercase = false;
  opts.Password.RequireUppercase = false;
  opts.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<DataContext>()
.AddDefaultTokenProviders();

// Adding authentication
builder.Services.AddAuthentication(opts =>
{
  opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
  opts.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
  };
});

// Adding authorization
builder.Services.AddAuthorization();

// Adding the controllers
builder.Services.AddControllers();

// Additional services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<KahootValidationService>();
builder.Services.AddScoped<LobbyService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Using the CORS policy to allow our dev environment (Next.js (with port 3000)) to make server calls
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

// Serve static files
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(
    Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Questions")),
  RequestPath = "/Uploads/Questions"
});

// Using authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// SignalR Hubs
app.MapHub<LobbyHub>("/hubs/lobbyhub");

// Using the controllers
app.MapControllers();

app.Run();
