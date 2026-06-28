# Scaling Setup Guide

This guide explains how to set up the project to handle 100+ concurrent users by configuring Redis and upgrading the Render plan.

## 1. Set Up Redis on Render

### Step 1: Create a Redis Instance
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button
3. Select "Redis"
4. Choose a name (e.g., `projectportal-redis`)
5. Select region (same as your web service)
6. Choose plan: **Free** (for testing) or **Starter** ($5/month for production)
7. Click "Create Redis"

### Step 2: Add Redis URL to Environment Variables
1. Go to your web service (projectportal-api)
2. Click "Environment" tab
3. Add new environment variable:
   - Key: `REDIS_URL`
   - Value: Copy from your Redis instance's "Connect" section
4. Click "Save Changes"
5. Your service will automatically redeploy

### Step 3: Verify Redis Connection
After deployment, check your service logs. You should see:
```
Connected to Redis
```

## 2. Upgrade Render Plan (for 100+ Users)

### Current Limitations (Free Tier)
- 512MB RAM
- 0.1 CPU
- Spins down after 15 minutes inactivity
- Cold start delays (10-30 seconds)
- Not suitable for 100+ concurrent users

### Recommended Upgrade: Starter Plan ($7/month)

### Step 1: Upgrade Web Service
1. Go to your web service (projectportal-api)
2. Click "Settings" tab
3. Scroll to "Plan" section
4. Click "Change Plan"
5. Select "Starter" ($7/month)
6. Click "Save Changes"

### Starter Plan Benefits
- 512MB RAM → 512MB RAM (same)
- 0.1 CPU → 0.5 CPU (5x more)
- No spin-down (always on)
- No cold starts
- Can handle 100+ concurrent users

### Alternative: Standard Plan ($25/month)
- 2GB RAM
- 1 CPU
- Better for 200+ concurrent users

## 3. Caching Implementation

The project now includes Redis caching for:

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
1. **Redis Memory Usage**: Check Redis dashboard
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
- ✅ Upgraded plan handles 100+ concurrent users
- ✅ No cold starts or spin-downs
- ✅ Better performance and reliability

## Cost Estimate

- Redis Free: $0/month
- Redis Starter: $5/month
- Web Service Starter: $7/month
- **Total**: $7-12/month for production

This setup can comfortably handle 100+ concurrent users.
