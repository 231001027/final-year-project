# ProjectPortal Deployment Guide

This guide will help you deploy ProjectPortal with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL

---

## Step 1: Set up Neon PostgreSQL Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "Create a project"
4. Choose a name (e.g., `projectportal-db`)
5. Select a region (choose one closest to your users)
6. Click "Create Project"
7. Copy the **Connection String** (it looks like: `postgres://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

---

## Step 2: Prepare Backend for Render

### 2.1 Create `.env` file in `/server` directory

Create a file at `/server/.env` with:
```env
DATABASE_URL=your_neon_connection_string_here
PORT=3001
```

Replace `your_neon_connection_string_here` with the Neon connection string from Step 1.

### 2.2 Update `server/package.json` for production

The current `start` script uses `node dist/index.js` which requires building. Let's update it to use tsx for simplicity:

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "start": "tsx src/index.ts",
  "build": "tsc",
  "db:setup": "tsx src/db/setup.ts",
  "db:seed": "tsx src/db/seed.ts",
  "db:clear": "tsx src/db/clear.ts"
}
```

### 2.3 Create `render.yaml` for Render configuration

Create a file at `/server/render.yaml`:
```yaml
services:
  - type: web
    name: projectportal-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: PORT
        value: 3001
```

---

## Step 3: Deploy Backend to Render

1. Go to [https://render.com](https://render.com)
2. Sign up or log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `projectportal-api`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `PORT`: `3001`
7. Click "Create Web Service"
8. Wait for deployment (takes 2-5 minutes)
9. Copy the deployed URL (e.g., `https://projectportal-api.onrender.com`)

---

## Step 4: Prepare Frontend for Vercel

### 4.1 Update `.env.example` in root directory

Update `/project/.env.example`:
```env
VITE_API_URL=https://your-render-backend-url.com/api
```

Replace `https://your-render-backend-url.com` with your Render backend URL from Step 3.

### 4.2 Remove proxy from `vite.config.ts` (not needed for production)

The proxy in `vite.config.ts` is only for local development. Vercel will handle API calls directly to your Render backend.

### 4.3 Create `vercel.json` for configuration (optional)

Create `/project/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## Step 5: Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL with `/api` suffix
     - Example: `https://projectportal-api.onrender.com/api`
7. Click "Deploy"
8. Wait for deployment (takes 1-2 minutes)
9. Copy the deployed URL (e.g., `https://projectportal.vercel.app`)

---

## Step 6: Seed the Database

After backend deployment, you need to seed the database:

1. Go to your Render dashboard
2. Click on your service → "Shell"
3. Run the following commands:
   ```bash
   npm run db:setup
   npm run db:seed
   ```

Or you can do this locally before deploying by setting your local `.env` to use the Neon connection string and running:
```bash
cd server
npm run db:setup
npm run db:seed
```

---

## Step 7: Test the Deployment

1. Visit your Vercel frontend URL
2. Try logging in as a student (team login)
3. Try selecting a project
4. Verify all functionality works

---

## Important Notes

### CORS Configuration
Your backend already has CORS enabled in `server/src/index.ts`. Make sure it allows requests from your Vercel domain.

### Environment Variables
- Never commit `.env` files to Git
- Always use environment variables for sensitive data
- Update environment variables in both Vercel and Render if they change

### Database Connection
- Neon provides a free tier with limits
- Monitor your database usage in the Neon dashboard
- The connection string includes SSL mode which is required

### Render Free Tier
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid tier for production use

### Vercel Free Tier
- Vercel free tier is generous for personal projects
- Includes SSL certificates automatically
- Fast global CDN

---

## Troubleshooting

### Backend won't start on Render
- Check the Render logs for errors
- Verify `DATABASE_URL` is correct
- Ensure all dependencies are in `package.json`

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct in Vercel
- Check CORS settings in backend
- Ensure backend is deployed and running

### Database connection errors
- Verify Neon connection string is correct
- Check if Neon database is active
- Ensure SSL mode is enabled in connection string

---

## Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database seeded with initial data
- [ ] Student login works
- [ ] Faculty login works
- [ ] Project selection works
- [ ] Faculty guide display works correctly
- [ ] All pages load without errors
