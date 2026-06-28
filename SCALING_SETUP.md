# Scaling Setup Guide (Free Tier)

This guide explains how to set up the project with Redis caching and rate limiting using Render's free tier.

## 1. Set Up Redis on Render (Free Tier)

### Step 1: Create a Redis Instance
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button
3. Select "Redis"
4. Choose a name (e.g., `projectportal-redis`)
5. Select region (same as your web service)
6. Choose plan: **Free**
7. Click "Create Redis"

### Step 2: Add Redis URL to Environment Variables
1. Go to your web service (projectportal-api)
2. Click "Environment" tab
3. Add new environment variable:
   - Key: `REDIS_URL`
   - Value: Copy from your Redis instance's "Connect" section
4. Click "Save Changes"
5. Your service will automatically redeploy

### Step 3: Add JWT_SECRET to Environment Variables
1. Go to your web service (projectportal-api)
2. Click "Environment" tab
3. Add new environment variable:
   - Key: `JWT_SECRET`
   - Value: Your JWT secret key (use a strong, random string)
4. Click "Save Changes"
5. Your service will automatically redeploy

**Important:** The JWT_SECRET is required for JWT authentication. Keep it secure and never commit it to version control.

### Step 4: Verify Redis Connection
After deployment, check your service logs. You should see:
```
Connected to Redis
```

## 2. Free Tier Limitations

### Current Free Tier Specs
- **Web Service**: 512MB RAM, 0.1 CPU
- **Redis**: 25MB RAM
- **Spin-down**: Web service spins down after 15 minutes inactivity
- **Cold starts**: 10-30 seconds on first request after spin-down
- **Concurrent users**: Can handle moderate traffic (not 100+ simultaneous)

### What Works on Free Tier
- ✅ Development and testing
- ✅ Small-scale production (10-20 concurrent users)
- ✅ Redis caching reduces database load
- ✅ Rate limiting prevents abuse
- ❌ Not suitable for 100+ concurrent users

## 3. Caching Implementation

The project includes Redis caching for:

### Cached Endpoints
- `GET /api/projects` - All projects (cached for 5 minutes)
- `GET /api/projects/available` - Available projects (cached for 1 minute)

### Cache Invalidation
- Cache is automatically invalidated when:
  - A new allocation is created (project selection)
  - Pattern-based invalidation clears all `projects:*` keys

### Cache Configuration
- Default TTL: 300 seconds (5 minutes)
- Available projects TTL: 60 seconds (1 minute)
- Graceful fallback: If Redis is unavailable, queries hit database directly

## 4. Rate Limiting

Rate limiting is configured to prevent abuse:
- **Limit**: 100 requests per 15 minutes per IP
- **Applied to**: All `/api/` routes
- **Response**: Returns 429 status with message when limit exceeded

## 5. Monitoring

After setup, monitor:
1. **Redis Memory Usage**: Check Redis dashboard (free tier: 25MB limit)
2. **Service CPU/RAM**: Check Render service metrics
3. **Response Times**: Monitor API performance
4. **Error Rates**: Check logs for cache errors

## 6. Testing

### Test Redis Connection
```bash
# Check if Redis is working
curl https://your-api-url/api/health
```

### Test Caching
1. First request to `/api/projects` - hits database
2. Second request within 5 minutes - hits cache (faster)
3. Create an allocation - cache invalidated
4. Next request - hits database again

### Test Rate Limiting
Make 100+ requests within 15 minutes from same IP - should get 429 error.

## Summary

After completing these steps:
- ✅ Redis caching reduces database load
- ✅ Rate limiting prevents abuse
- ✅ Free tier setup complete
- ⚠️ Cold starts may occur (15 min inactivity)
- ⚠️ Limited to 10-20 concurrent users on free tier

## Cost (Free Tier)

- Redis Free: $0/month
- Web Service Free: $0/month
- **Total**: $0/month

## For 100+ Concurrent Users

To handle 100+ concurrent users, you would need to upgrade:
- Web Service to Starter plan ($7/month)
- Redis to Starter plan ($5/month)
- **Total**: $12/month

This provides:
- 5x more CPU (0.5 instead of 0.1)
- No spin-down (always on)
- No cold starts
- Can handle 100+ concurrent users
