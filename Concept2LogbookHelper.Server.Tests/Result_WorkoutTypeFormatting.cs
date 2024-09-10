using Concept2LogbookHelper.Server.Models.Concept2;

namespace Concept2LogbookHelper.Server.Services
{
    public class Result_WorkoutTypeFormatting
    {
        [Fact]
        public void FormatFixedDistance()
        {
            var result = new Result()
            {
                workout_type = "FixedDistanceSplits",
                distance = 2000
            };
            
            result.CalculateAndSetPrettyWorkoutType();


            Assert.Equal("2000m", result.pretty_workout_type);
        }

        [Fact]
        public void FormatDistanceIntervals()
        {
            var result = new Result()
            {
                workout_type = "FixedDistanceInterval",
                workout = new Workout()
                {
                    intervals = [ 
                        new Interval {
                            type="distance",
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        },
                        new Interval {
                            distance = 500
                        }
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("8x500m", result.pretty_workout_type);
        }

        [Fact]
        public void FormatTimeIntervals()
        {
            var result = new Result()
            {
                workout_type = "FixedTimeInterval",
                workout = new Workout()
                {
                    intervals = [
                        new Interval {
                            type="time",
                            time = 6000
                        },
                        new Interval {
                            type="time",
                            time = 6000
                        },
                        new Interval {
                            type="time",
                            time = 6000
                        },
                        new Interval {
                            type="time",
                            time = 6000
                        },
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("4x10:00", result.pretty_workout_type);
        }

        [Fact]
        public void FormatVariableIntervals_DifferentTypes()
        {
            var result = new Result()
            {
                workout_type = "VariableInterval",
                workout = new Workout()
                {
                    intervals = [
                        new Interval {
                            type="distance",
                            distance = 2000
                        },
                        new Interval {
                            type="time",
                            time = 6000
                        },
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("v2000m,10:00..2", result.pretty_workout_type);
        }


        [Fact]
        public void FormatVariableIntervals_VariableDistances()
        {
            var result = new Result()
            {
                workout_type = "VariableInterval",
                workout = new Workout()
                {
                    intervals = [
                        new Interval {
                            type="distance",
                            distance = 250
                        },
                        new Interval {
                            type="distance",
                            distance = 500
                        },
                        new Interval {
                            type="distance",
                            distance = 750
                        },
                        new Interval {
                            type="distance",
                            distance = 1000
                        },
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("v250m,500m..4", result.pretty_workout_type);
        }

        [Fact]
        public void FormatVariableIntervals_SingleInterval()
        {
            var result = new Result()
            {
                workout_type = "VariableInterval",
                workout = new Workout()
                {
                    intervals = [
                        new Interval {
                            type="distance",
                            distance = 250
                        }
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("v250m..1", result.pretty_workout_type);
        }

        [Fact]
        public void FormatUnknownIntervals()
        {
            var result = new Result()
            {
                workout_type = "VariableInterval",
                workout = new Workout()
                {
                    intervals = [
                        new Interval {
                            type="junk_type",
                            time = 6000,
                            distance = 2000
                        },
                        new Interval {
                            type="junk_type",
                            time = 6000,
                            distance = 2000
                        },
                    ]
                }
            };

            result.CalculateAndSetPrettyWorkoutType();

            Assert.Equal("vN/A,N/A..2", result.pretty_workout_type);
        }
    }
}