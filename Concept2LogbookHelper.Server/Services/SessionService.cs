﻿using Concept2LogbookHelper.Extensions;
using Concept2LogbookHelper.Server.Models;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Security.Permissions;

namespace Concept2LogbookHelper.Server.Services
{
    public class SessionService : ISessionService
    {
        private readonly IDistributedCache _cache;
        private readonly string redisConnectionString;

        public SessionService(IDistributedCache cache, string redisConnectionString)
        {
            this._cache = cache;
            this.redisConnectionString= redisConnectionString;
        }

        public async Task<string> StoreNewAccessToken(string access_token, string refresh_token, int expires_in, string? sessionID = null, int expirationDays = 14)
        {
            // if no sessionId passed, generate new
            sessionID ??= Guid.NewGuid().ToString();

            await _cache.SetStringAsync("access_" + sessionID, access_token, new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(expires_in),
                SlidingExpiration = TimeSpan.FromDays(1)
            });

            await _cache.SetStringAsync("refresh_" + sessionID, refresh_token, new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(expirationDays),
                SlidingExpiration = TimeSpan.FromDays(expirationDays)
            });

            return sessionID;
        }

        public async Task<string> GetStoredAccessToken(string sessionId)
        {
            string? data = await _cache.GetStringAsync("access_" + sessionId);

            if (data is not null) return data;
            else throw new KeyNotFoundException($"No access token found for session Id: {sessionId}");

        }

        public async Task<string> GetStoredRefreshToken(string sessionId)
        {
            string? data = await _cache.GetStringAsync("refresh_" + sessionId);

            if (data is null) throw new KeyNotFoundException($"No refresh token found for session Id: {sessionId}");
            return data;
        }

        public async Task LogOut(string sessionId)
        {
            await _cache.RemoveAsync("refresh_" + sessionId);
            await _cache.RemoveAsync("access_" + sessionId);
        }

        public async Task<StoredToken> GetTokenDetails(string sessionId)
        {

            ConnectionMultiplexer connection = ConnectionMultiplexer.Connect(redisConnectionString);
            IDatabase cache = connection.GetDatabase();


            RedisKey accesskey = new("access_" + sessionId);
            DateTime? accessExpiryTime = await cache.KeyExpireTimeAsync(accesskey);

            RedisKey refreshkey = new("refresh_" + sessionId);
            DateTime? refreshExpiryTime = await cache.KeyExpireTimeAsync(refreshkey);

            return new StoredToken()
            {
                AccessExpiryDate = accessExpiryTime,
                RefreshExpiryDate = refreshExpiryTime,
                AccessTokenExists = accessExpiryTime is not null,
                RefreshTokenExists = refreshExpiryTime is not null
            };
        }
    }
}
