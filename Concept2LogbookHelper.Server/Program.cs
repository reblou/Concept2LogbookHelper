using Concept2LogbookHelper.Server.Models;
using Concept2LogbookHelper.Server.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection.Metadata.Ecma335;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

IConfiguration configuration = builder.Configuration;
builder.Services.Configure<AuthenticationOptions>(configuration.GetSection("Authentication"));

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = configuration.GetConnectionString("Redis");
});

builder.Services.AddSingleton<ISessionService, SessionService>(serviceProvider =>
{
    return new SessionService(serviceProvider.GetService<IDistributedCache>(), configuration.GetConnectionString("Redis"));
});
builder.Services.AddSingleton<IConcept2APIService,  Concept2APIService>();





var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
