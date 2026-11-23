using Concept2LogbookHelper.Server.Models.Concept2;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Concept2LogbookHelper.Server.Tests;

public class HeartRateZoneRequestValidationTests
{
    [Theory]
    [InlineData(1, 200, 100, true, null)]
    [InlineData(0, 200, 100, true, nameof(HeartRateZoneRequest.WorkoutId))]
    [InlineData(1, 0, 100, true, nameof(HeartRateZoneRequest.MaxHeartRate))]
    [InlineData(1, 200, 0, true, nameof(HeartRateZoneRequest.WorkTime))]
    [InlineData(1, 200, 100, false, nameof(HeartRateZoneRequest.IntervalWorkTimes))]
    public void MvcValidatesRecordConstructorParameters(
        int workoutId, int maxHeartRate, int workTime, bool hasIntervals, string? invalidField)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddControllers();
        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = new ActionContext(
            new DefaultHttpContext { RequestServices = scope.ServiceProvider },
            new RouteData(),
            new ActionDescriptor());
        var validator = scope.ServiceProvider.GetRequiredService<IObjectModelValidator>();
        var request = new HeartRateZoneRequest(workoutId, maxHeartRate, workTime, hasIntervals ? [] : null!);

        validator.Validate(context, validationState: null, prefix: "", model: request);

        Assert.Equal(invalidField is null, context.ModelState.IsValid);
        if (invalidField is not null)
            Assert.NotEmpty(context.ModelState[invalidField]!.Errors);
    }
}
