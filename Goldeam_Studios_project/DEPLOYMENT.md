# Deployment Guide - Goldbeam Studios

## Quick Deploy to Vercel (Recommended)

### Step 1: Prepare for Deployment

```bash
# Test production build locally
npm run build
npm run preview
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain (e.g., `goldbeamstudios.com`)
4. Follow DNS configuration instructions

## Alternative Deployment Options

### Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

Or use Netlify's drag-and-drop feature:
1. Build: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to deploy

### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t goldbeam-studios .
docker run -p 80:80 goldbeam-studios
```

## Environment Variables

Create `.env` file for environment-specific configurations:

```env
# Supabase (when integrated)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Square (when integrated)
VITE_SQUARE_APP_ID=your_square_app_id
VITE_SQUARE_LOCATION_ID=your_square_location_id

# Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify mobile responsiveness
- [ ] Check navigation links work
- [ ] Test contact form (when integrated)
- [ ] Verify Square booking widget (when integrated)
- [ ] Check image loading and optimization
- [ ] Test performance with Lighthouse
- [ ] Verify SEO meta tags
- [ ] Set up SSL certificate (auto with Vercel/Netlify)
- [ ] Configure custom domain
- [ ] Set up analytics
- [ ] Test across different browsers

## Performance Optimization

### Before Deployment

1. **Optimize Images**
   ```bash
   # Use WebP format for images
   # Compress images with tools like TinyPNG
   ```

2. **Code Splitting** (already configured with Vite)

3. **Bundle Analysis**
   ```bash
   npm run build -- --mode analyze
   ```

### After Deployment

1. Run Lighthouse audit
2. Enable CDN (automatic with Vercel)
3. Configure caching headers
4. Set up monitoring (Vercel Analytics, Google Analytics)

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Routing Issues (404 on refresh)

For Vercel, create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

For Netlify, create `_redirects` in `public/`:

```
/*    /index.html   200
```

### Large Bundle Size

1. Analyze bundle: `npm run build -- --mode analyze`
2. Implement code splitting
3. Lazy load routes
4. Optimize images

## Support

For deployment issues or questions, contact the development team.
