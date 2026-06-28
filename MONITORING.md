# Monitoring Guide

This guide explains how to monitor the Project Portal application using Render's built-in metrics and logging.

## Environment Variables

The following environment variables are required for the application to function correctly:

- **DATABASE_URL** - PostgreSQL database connection string
- **PORT** - Server port (default: 3001)
- **REDIS_URL** - Redis connection string (optional, for caching)
- **JWT_SECRET** - Secret key for JWT token generation (required for authentication)
- **CORS_ORIGIN** - Allowed CORS origins (optional)

**Important:** Never commit the `.env` file or any secrets to version control. Use environment variables in production.

## Render Built-in Monitoring

Render provides built-in monitoring for all services at no additional cost.

### Metrics Dashboard

1. Go to your service dashboard on Render
2. Click on the "Metrics" tab
3. View the following metrics:

**Key Metrics to Monitor:**
- **CPU Usage** - Percentage of CPU being used
- **Memory Usage** - RAM consumption
- **Response Time** - Average response time for requests
- **Request Rate** - Number of requests per second
- **Error Rate** - Percentage of failed requests

### Logs

1. Go to your service dashboard on Render
2. Click on the "Logs" tab
3. View real-time logs from your application

**Log Levels:**
- `info` - General information (server startup, successful operations)
- `error` - Errors and exceptions
- `warn` - Warning messages

### Setting Up Alerts

Render allows you to set up alerts for:

1. **CPU Usage Alert**
   - Go to Metrics → Alerts
   - Set threshold (e.g., 80% CPU for 5 minutes)
   - Get notified via email or Slack

2. **Memory Usage Alert**
   - Set threshold (e.g., 90% memory for 5 minutes)
   - Prevent out-of-memory errors

3. **Error Rate Alert**
   - Set threshold (e.g., 5% error rate)
   - Get notified when errors spike

## Winston Logging

The application uses Winston for structured logging:

### Log Files

Logs are stored in the `logs/` directory:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

### Log Format

Logs are structured JSON with the following fields:
```json
{
  "level": "info",
  "message": "ProjectPortal API running on http://localhost:3001",
  "service": "projectportal-api",
  "timestamp": "2024-06-28 12:00:00"
}
```

### Custom Logging

To add custom logging in your code:

```typescript
import logger from './utils/logger.js';

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', { error: err });
```

## Performance Monitoring

### Key Performance Indicators (KPIs)

Monitor these KPIs to ensure optimal performance:

1. **Response Time**
   - Target: < 200ms for API endpoints
   - Warning: > 500ms
   - Critical: > 1000ms

2. **Error Rate**
   - Target: < 1%
   - Warning: > 3%
   - Critical: > 5%

3. **CPU Usage**
   - Target: < 50%
   - Warning: > 70%
   - Critical: > 90%

4. **Memory Usage**
   - Target: < 70%
   - Warning: > 85%
   - Critical: > 95%

## Database Monitoring

### PostgreSQL Metrics (Neon)

1. Go to Neon Dashboard
2. Select your database
3. View metrics:
   - Active connections
   - Query performance
   - Storage usage
   - I/O operations

### Slow Query Logging

To enable slow query logging in PostgreSQL:

```sql
ALTER SYSTEM SET log_min_duration_statement = '1000'; -- Log queries > 1s
```

## Redis Monitoring

### Redis Metrics

1. Go to Redis Dashboard on Render
2. View metrics:
   - Memory usage
   - Hit rate
   - Connections
   - Operations per second

### Cache Performance

Monitor cache hit rate:
- Target: > 80%
- Warning: < 60%
- Critical: < 40%

## Load Testing

Use Artillery to test performance:

```bash
# Run load test
npm run test:load

# Or use artillery directly
artillery run load-test.yml
```

### Load Test Results

Artillery provides:
- Response time percentiles (p50, p95, p99)
- Request count
- Error count
- RPS (requests per second)

## Troubleshooting

### High CPU Usage
- Check for inefficient queries
- Review caching strategy
- Consider upgrading plan

### High Memory Usage
- Check for memory leaks
- Review Redis memory usage
- Restart service if needed

### High Error Rate
- Check logs for error patterns
- Review recent deployments
- Check database connectivity

### Slow Response Times
- Check database query performance
- Review cache hit rate
- Check network latency

## External Monitoring (Optional)

For advanced monitoring, consider:

### New Relic
- APM (Application Performance Monitoring)
- Infrastructure monitoring
- Real user monitoring

### DataDog
- Full-stack monitoring
- Log management
- Synthetic monitoring

### Sentry
- Error tracking
- Performance monitoring
- Release tracking

## Summary

Render provides comprehensive built-in monitoring at no additional cost. Key metrics to monitor:
- CPU and memory usage
- Response times
- Error rates
- Database performance
- Redis performance

Set up alerts to get notified when metrics exceed thresholds.
