# Vercel Deployment Guide

This guide describes how to deploy the **Weekend Traveller** application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account.
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional, can also deploy via Git).

## Deployment Steps

### Method 1: Deploy via Git (Recommended)

1. **Push to GitHub**: Ensure your latest changes are pushed to your GitHub repository.
2. **Import Project in Vercel**:
   - Go to your Vercel Dashboard.
   - Click "Add New..." -> "Project".
   - Select your GitHub repository.
3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Environment Variables**: Add the following:
     - `OPENAI_API_KEY`: Your OpenAI API Key.
     - `NEXT_PUBLIC_API_URL`: Set this to your Vercel domain followed by `/api` (e.g., `https://your-project.vercel.app/api`).
       > **Note**: For the first deploy, you can leave `NEXT_PUBLIC_API_URL` empty or set it to `/api` (relative path) if frontend and backend are on the same domain.
4. **Deploy**: Click "Deploy".

### Method 2: Deploy via CLI

1. Run `vercel login` if you haven't already.
2. Run `vercel` in the project root.
3. Follow the prompts.
4. When asked for environment variables, add them in the Vercel dashboard or via `vercel env add`.

## Verification

After deployment:

1. Visit the deployed URL.
2. Check if the "Background Video" loads (this verifies the API is working).
3. Try a search or check "Recommendations" (requires Location permission).
4. Visit `/api/health` to check backend status.

## Troubleshooting

- **500 Internal Server Error**: Check "Runtime Logs" in Vercel Dashboard -> Deployments -> [Your Deployment] -> Functions.
- **CORS Issues**: The backend is configured to allow `*` (all origins), but check browser console if requests fail.
